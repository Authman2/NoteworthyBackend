const firebase = require('firebase');

// Login route. Accepts the user's email and password
// and, if successful, will return the current user.
// Otherwise, it will return an error.
const handleLogin = (server, admin) => {
    server.route({
        method: 'POST',
        path: '/login',
        async handler(req, rep) {
            const data = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
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
                        token: tok,
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