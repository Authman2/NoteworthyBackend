import Account from '../controllers/AccountController';

// Route for creating a new account.
const handleCreateAccount = server => {
    server.route({
        method: 'post',
        path: '/create-account',
        
        async handler(req, rep) {
            const data = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
            const email = data['email'];
            const pass = data['password'];

            return Account.createAccount(email, pass, req, rep);
        }
    });
}

module.exports = handleCreateAccount;