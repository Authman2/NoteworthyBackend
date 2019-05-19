const Account = require('../controllers/AccountController');

// Logout route. Logs the user out of their account
// and returns a boolean whether or not they were
// successfully logged out.
const handleLogout = (server) => {
    server.route({
        method: 'get',
        path: '/logout',
        async handler(req, rep) {
            return Account.logout(req, rep);
        }
    });
}
module.exports = handleLogout;