const firebase = require('firebase');

// Saves the most recent version of the current note to the database.
const handleSaveNotebook = (server) => {
    server.route({
        method: 'put',
        path: '/restore',
        async handler(req, rep) {
            // Get the current user.
            const params = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const uid = params['uid'];
            if(!uid) {
                return rep.response('No user is currently logged in, so the notebook could not be saved.').code(400);
            }

            // Get the list of notebooks and notes all together.
            const data = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
            const { notebooksAndNotes } = data;
            const allData = JSON.parse(notebooksAndNotes);

            // Save the entire structure to the database.
            try {
                await firebase.database().ref().child(uid).set(allData);
                return rep.response('Saved!').code(200);
            } catch(err) {
                return rep.response(''+err).code(500);
            }
        }
    });
}

module.exports = handleSaveNotebook;