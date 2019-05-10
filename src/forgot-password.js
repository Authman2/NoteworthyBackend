const firebase = require('firebase');

// Route for sending a forgot password email.
const handleForgotPassword = server => {
    server.route({
        method: 'put',
        path: '/forgot-password',
        
        async handler(req, rep) {
            const params = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const email = params.email;

            try {
                await firebase.auth().sendPasswordResetEmail(email);
                Globals.showActionAlert(`Sent password reset email to ${email}!`, Globals.ColorScheme.gray);
                return rep.response(true).code(200);
            } catch(err) {
                return rep.response(''+err).code(500);
            }
        }
    });
}

module.exports = handleForgotPassword;