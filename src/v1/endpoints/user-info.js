const Hapi = require('hapi');
const Account = require('../controllers/AccountController');

// Returns information about the current user.
const handleGetUserInfo = (server = new Hapi.Server({ port: 8000 })) => {
    server.route({
        method: 'GET',
        path: '/get-user-info',
        handler(req, rep) {
            return Account.getUserInfo(req, rep);
        }
    });
}

module.exports = handleGetUserInfo;