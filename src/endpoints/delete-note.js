const NoteController = require('../controllers/NoteController');

// The route for deleting a single note.
const handleDeleteNote = (server) => {
    server.route({
        method: 'delete',
        path: '/delete-note',
        async handler(req, rep) {
            // Get the currently logged in user.
            const params = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const uid = params.uid;
            if(!uid) return rep.response('No user is currently logged in, so no notebooks were recevied.').code(400);

            // Get the ID of the note you are trying to delete.
            const data = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
            const { noteID } = data;
            return NoteController.delete(uid, noteID, req, rep);
        }
    });
}

module.exports = handleDeleteNote;