import NoteController from '../controllers/NoteController';

// Notes route. Returns the list of all of the user's
// notes in a given notebook from the database.
const handleGetNotes = (server) => {
    server.route({
        method: 'get',
        path: '/notes',
        
        async handler(req, rep) {
            // Get the currently logged in user.
            const params = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const uid = params.uid;
            if(!uid) return rep.response('No user is currently logged in, so no notebooks were recevied.').code(400);

            // We also need the id of the notebook to look for notes in.
            const notebookID = params['notebookID'];
            return NoteController.get(uid, notebookID, req, rep);
        }
    });
}

module.exports = handleGetNotes;