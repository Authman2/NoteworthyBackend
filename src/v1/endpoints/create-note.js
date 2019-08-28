const NoteController = require('../controllers/NoteController');

// Handles creating a new note in the database
// under the currently logged in user.
const handleCreateNote = (server) => {
    server.route({
        method: 'post',
        path: '/create-note',
        
        async handler(req, rep) {
            // Get the current user.
            const params = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const token = params.token;
            if(!token) return rep.response('No user is currently logged in, so a note could not be created.').code(400);

            // Get the data needed to populate the note.
            const data = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
            const { title, content, notebookID } = data;
            return NoteController.createNote(token, title, content, notebookID, req, rep);
        }
    });
}

module.exports = handleCreateNote;