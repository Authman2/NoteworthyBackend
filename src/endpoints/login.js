import Hapi from 'hapi';
import Account from '../controllers/AccountController';

// Login route. Accepts the user's email and password
// and, if successful, will return the current user.
// Otherwise, it will return an error.
const handleLogin = (server = new Hapi.Server({ port: 8000 }), admin) => {
    server.route({
        method: 'GET',
        path: '/login',
        async handler(req, rep) {
            const data = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const email = data['email'];
            const pass = data['password'];
            const tok = data['token'];

            return Account.login(email, pass, tok, req, rep);
        }
    });
}

module.exports = handleLogin;