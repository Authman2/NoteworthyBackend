// Login route. Accepts the user's email and password
// and, if successful, will return the current user.
// Otherwise, it will return an error.
const handleLogout = (server) => {
    server.route({
        method: 'get',
        path: '/login',
        handler(req, rep) {
            return 'Logging in!';
        }
    });
}

module.exports = handleLogout;