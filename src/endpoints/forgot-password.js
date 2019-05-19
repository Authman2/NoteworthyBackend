const Account = require('../controllers/AccountController');

// Route for sending a forgot password email.
const handleForgotPassword = server => {
    server.route({
        method: 'PUT',
        path: '/forgot-password',
        
        async handler(req, rep) {
            const params = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
            const email = params.email;

            return Account.forgotPassword(email, req, rep);
        }
    });
}

module.exports = handleForgotPassword;