const Account = require('../controllers/AccountController');

// Route for creating a new account.
const handleCreateAccount = server => {
    server.route({
        method: 'POST',
        path: '/create-account',
        handler(req, rep) {
            const data = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
            const email = data['email'];
            const pass = data['password'];

            if(!email || !pass || email === '' || pass === '')
                return rep.response('Please enter all fields.').code(500);
            return Account.createAccount(email, pass, req, rep);
        }
    });
}

module.exports = handleCreateAccount;