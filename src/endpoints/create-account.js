// Route for creating a new account.
const handleCreateAccount = (server, fireAuth) => {
    server.route({
        method: 'post',
        path: '/create-account',
        async handler(req, rep) {
            const data = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
            const email = data['email'];
            const pass = data['password'];

            try {
                const resp = await fireAuth.createUserWithEmailAndPassword(email, pass);
                return resp;
            } catch(err) {
                return rep.response(''+err).code(500);
            }
        }
    });
}

module.exports = handleCreateAccount;