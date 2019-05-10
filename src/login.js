const firebase = require('firebase');
const admin = require('firebase-admin');

// Login route. Accepts the user's email and password
// and, if successful, will return the current user.
// Otherwise, it will return an error.
const handleLogin = (server, admin) => {
    server.route({
        method: 'get',
        path: '/login',
        async handler(req, rep) {
            const data = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const email = data['email'];
            const pass = data['password'];
            const tok = data['token'];

            try {
                // Return the user.
                let result;
                if(tok) {
                    result = await firebase.auth().signInWithCustomToken(tok);
                    return rep.response({
                        email,
                        tok,
                        uid: result.user.uid
                    }).code(200);
                } else {
                    result = await firebase.auth().signInWithEmailAndPassword(email, pass);
                    const token = await admin.auth().createCustomToken(result.user.uid);
                    return rep.response({
                        email,
                        token,
                        uid: result.user.uid
                    }).code(200);
                }
            } catch(err) {
                // Return an error.
                return rep.response(''+err).code(500);
            }
        }
    });
}

module.exports = handleLogin;