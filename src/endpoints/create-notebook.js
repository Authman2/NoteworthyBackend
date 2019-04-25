const Moment = require('moment');

// Handles creating a new notebook in the database
// under the currently logged in user.
const handleCreateNotebook = (server, fireAuth, fireRef) => {
    server.route({
        method: 'post',
        path: '/create-notebook',
        async handler(req, rep) {
            // Get the current user.
            const cUser = fireAuth.currentUser;
            if(!cUser) return rep.response('No user is currently logged in, so a notebook could not be created.').code(400);

            // Get the data needed to populate the notebook.
            const data = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
            const { title } = data;
            const now = new Moment();
            const saveDate = [now.year(), now.month(), now.day(), now.hours(), now.minutes(), now.seconds()];
            
            // Create a new document for the notebook.
            const newObj = {
                title,
                created: saveDate,
                pages: [],
                creator: cUser.uid
            }

            // Save the item into the database.
            try {
                const ref = fireRef.child(cUser.uid).push();
                const obj = {
                    ...newObj,
                    id: ref.key
                }
                await ref.set(obj);
                return rep.response(obj).code(200);
            } catch(err) {
                return rep.response(''+err).code(500);
            }
        }
    });
}

module.exports = handleCreateNotebook;