const NotebookController = require('../controllers/NotebookController');

// The route for deleting a single notebook.
const handleDeleteNotebook = (server) => {
    server.route({
        method: 'delete',
        path: '/delete-notebook',
        async handler(req, rep) {
            // Get the currently logged in user.
            const params = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const uid = params.uid;
            if(!uid)  return rep.response('No user is currently logged in, so no notebooks were recevied.').code(400);
            
            // Get the ID of the notebook you are trying to delete.
            const data = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
            const { notebookID } = data;
            return NotebookController.delete(uid, notebookID, req, rep);
        }
    });
}

module.exports = handleDeleteNotebook;