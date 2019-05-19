import Account from '../controllers/AccountController';

// Route for sending a forgot password email.
const handleForgotPassword = server => {
    server.route({
        method: 'GET',
        path: '/forgot-password',
        
        async handler(req, rep) {
            const params = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const email = params.email;

            return Account.forgotPassword(email, req, rep);
        }
    });
}

module.exports = handleForgotPassword;