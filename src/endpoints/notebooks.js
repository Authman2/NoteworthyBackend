const NotebookController = require('../controllers/NotebookController');

// Notebooks route. Returns the list of all of the user's
// notebooks from the database.
const handleGetNotebooks = (server) => {
    server.route({
        method: 'GET',
        path: '/notebooks',
        
        async handler(req, rep) {
            // Get the currently logged in user.
            const params = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const token = params.token;
            if(!token) return rep.response('No user is currently logged in, so no notebooks were recevied.').code(400);
            return NotebookController.get(token, req, rep);
        }
    });
}

module.exports = handleGetNotebooks;