const NotebookController = require('../controllers/NotebookController');

// Handles creating a new notebook in the database
// under the currently logged in user.
const handleCreateNotebook = (server) => {
    server.route({
        method: 'post',
        path: '/create-notebook',
        
        async handler(req, rep) {
            // Get the current user.
            const params = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const token = params.token;
            if(!token) return rep.response('No user is currently logged in, so a notebook could not be created.').code(400);

            // Get the data needed to populate the notebook.
            const data = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
            const { title } = data;
            return NotebookController.createNotebook(token, title, req, rep);
        }
    });
}

module.exports = handleCreateNotebook;