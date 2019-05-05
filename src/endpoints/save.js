const firebase = require('firebase');

// Saves all of the notebooks and notes as they are in their
// current state into the database.
const handleSave = (server) => {
    server.route({
        method: 'post',
        path: '/save',
        async handler(req, rep) {
            // Get the current user.
            const params = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const uid = params.uid;
            if(!uid) return rep.response('No user is currently logged in, so a note could not be created.').code(400);

            // Get the list of notebooks and notes all together.
            const data = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
            const { notebooksAndNotes } = data;

            // Save the entire structure to the database.
            const outer = `{"${uid}": ${notebooksAndNotes}}`;
            try {
                await firebase.database().ref().set(JSON.parse(outer));
                return rep.reponse(notebooksAndNotes).code(200);
            } catch(err) {
                return rep.response(''+err).code(500);
            }
        }
    });
}

module.exports = handleSave;