const firebase = require('firebase');

// Handles creating a new notebook in the database
// under the currently logged in user.
const handleCreateNotebook = (server) => {
    server.route({
        method: 'post',
        path: '/create-notebook',
        
        async handler(req, rep) {
            // Get the current user.
            const params = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const uid = params.uid;
            if(!uid) return rep.response('No user is currently logged in, so a notebook could not be created.').code(400);

            // Get the data needed to populate the notebook.
            const data = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
            const { title } = data;
            const saveDate = Date.now();
            
            // Create a new document for the notebook.
            const newObj = {
                title,
                created: saveDate,
                pages: [],
                creator: uid
            }

            // Save the item into the database.
            try {
                const ref = firebase.database().ref().child(uid).push();
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