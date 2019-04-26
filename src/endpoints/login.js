// Login route. Accepts the user's email and password
// and, if successful, will return the current user.
// Otherwise, it will return an error.
const handleLogin = (server, fireAuth) => {
    server.route({
        method: 'get',
        path: '/login',
        async handler(req, rep) {
            const data = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const email = data['email'];
            const pass = data['password'];

            fireAuth.onAuthStateChanged(user => {
                if(user) {
                    return rep.response({
                        email,
                        uid: user['uid']
                    }).code(200);
                }
            });
            
            try {
                // Return the user.
                const result = await fireAuth.signInWithEmailAndPassword(email, pass);
                return rep.response({
                    email,
                    uid: result['user']['uid']
                }).code(200);
            } catch(err) {
                // Return an error.
                return rep.response(''+err).code(500);
            }
        }
    });
}

module.exports = handleLogin;