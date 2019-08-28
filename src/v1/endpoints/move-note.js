const NoteController = require('../controllers/NoteController');

// Route that handles moving a note from one notebook to another.
const handleMoveNote = (server) => {
    server.route({
        method: 'PUT',
        path: '/move-note',
        async handler(req, rep) {
            // Get the currently logged in user.
            const params = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const token = params.token;
            if(!token) return rep.response('No user is currently logged in, so no notebooks were recevied.').code(400);

            // Get the noteID, the notebookID to move it from and the
            // notebookID to move it to.
            const data = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
            const { noteID, fromNotebook, toNotebook } = data;

            return NoteController.move(token, noteID, fromNotebook, toNotebook, req, rep);
        }
    })
}

module.exports = handleMoveNote;