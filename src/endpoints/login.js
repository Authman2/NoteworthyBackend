// Login route. Accepts the user's email and password
// and, if successful, will return the current user.
// Otherwise, it will return an error.
const handleLogin = (server, fireAuth, admin) => {
    server.route({
        method: 'get',
        path: '/login',
        options: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        async handler(req, rep) {
            const data = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const email = data['email'];
            const pass = data['password'];

            try {
                // Return the user.
                const result = await fireAuth.signInWithEmailAndPassword(email, pass);
                const token = await admin.auth().createCustomToken(result.user.uid);
                return rep.response({
                    email,
                    token,
                    uid: result.user.uid
                }).code(200);
            } catch(err) {
                // Return an error.
                return rep.response(''+err).code(500);
            }
        }
    });
}

module.exports = handleLogin;