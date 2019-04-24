// Logout route. Logs the user out of their account
// and returns a boolean whether or not they were
// successfully logged out.
const handleLogout = (server) => {
    server.route({
        method: 'get',
        path: '/logout',
        handler(req, rep) {
            return true;
        }
    });
}
module.exports = handleLogout;