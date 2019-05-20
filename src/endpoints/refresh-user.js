const AccountController = require('../controllers/AccountController');

// Restores notes and notebooks from the database.
const handleRefresh = (server) => {
    server.route({
        method: 'GET',
        path: '/refresh-user',
        async handler(req, rep) {
            // Get the current user.
            const params = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const token = params['token'];
            if(!token)
                return rep.response('No user is currently logged in, so the notebook could not be saved.').code(400);

            return AccountController.refresh(token, req, rep);
        }
    });
}

module.exports = handleRefresh;