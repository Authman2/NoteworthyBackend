import NoteController from '../controllers/NoteController';

// Route that handles moving a note from one notebook to another.
const handleMoveNote = (server) => {
    server.route({
        method: 'put',
        path: '/move-note',
        async handler(req, rep) {
            // Get the currently logged in user.
            const params = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const uid = params.uid;
            if(!uid) return rep.response('No user is currently logged in, so no notebooks were recevied.').code(400);
            const fireRef = firebase.database().ref();

            // Get the noteID, the notebookID to move it from and the
            // notebookID to move it to.
            const data = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
            const { noteID, fromNotebook, toNotebook } = data;

            return NoteController.move(uid, noteID, fromNotebook, toNotebook, req, rep);
        }
    })
}

module.exports = handleMoveNote;