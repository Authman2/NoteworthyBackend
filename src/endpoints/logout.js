const firebase = require('firebase');

// Logout route. Logs the user out of their account
// and returns a boolean whether or not they were
// successfully logged out.
const handleLogout = (server) => {
    server.route({
        method: 'get',
        path: '/logout',
        async handler(req, rep) {
            try {
                await firebase.auth().signOut();
                return rep.response(true).code(200);
            } catch(err) {
                return rep.response(''+err).code(500);
            }
        }
    });
}
module.exports = handleLogout;