const firebase = require('firebase');

// Saves the most recent version of the current note to the database.
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
            const { noteID, title, content } = data;

            // Save the entire structure to the database.
            try {
                const old = (await firebase.database().ref().child(uid).child(noteID).once('value')).val;
                const saved = { ...old, title, content };
                await firebase.database().ref().child(uid).child(noteID).set(saved);
                return rep.response(saved).code(200);
            } catch(err) {
                return rep.response(''+err).code(500);
            }
        }
    });
}

module.exports = handleSave;