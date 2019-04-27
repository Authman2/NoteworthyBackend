// Route for creating a new account.
const handleCreateAccount = (server, fireAuth) => {
    server.route({
        method: 'get',
        path: '/create-account',
        async handler(req, rep) {
            const data = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const email = data['email'];
            const pass = data['password'];

            try {
                await fireAuth.createUserWithEmailAndPassword(email, pass);
                return true;
            } catch(err) {
                return rep.response(''+err).code(500);
            }
        }
    });
}

module.exports = handleCreateAccount;