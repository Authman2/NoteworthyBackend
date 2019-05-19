const Hapi = require('hapi');
const Account = require('../controllers/AccountController');

// Login route. Accepts the user's email and password
// and, if successful, will return the current user.
// Otherwise, it will return an error.
const handleLogin = (server = new Hapi.Server({ port: 8000 }), admin) => {
    server.route({
        method: 'POST',
        path: '/login',
        async handler(req, rep) {
            const data = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
            const email = data['email'];
            const pass = data['password'];
            const tok = data['token'];

            return Account.login(email, pass, tok, req, rep);
        }
    });
}

module.exports = handleLogin;