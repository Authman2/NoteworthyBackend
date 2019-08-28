const Hash = require('password-hash');
const JWT = require('jsonwebtoken');
const { User, openDB } = require('../schemas');

module.exports = {

    // Creates a new user in the database.
    createUser: async function(req, rep, { firstName, lastName, email, password }) {
        await openDB('UserInfo');

        const usr = new User({
            firstName,
            lastName,
            email,
            passwordHash: Hash.generate(password),
            created: Date.now(),
            lastLogin: Date.now()
        });
        await usr.save();
        return rep.response({}).code(200);
    },


    // Logs the user into their account.
    login: async function(req, rep, { email, password }) {
        await openDB('UserInfo');

        // Find the user with the given email in the db.
        const user = await User.findOne({ email });
        if(!user) {
            return rep.response({
                message: "Error: Couldn't find a user with that email."
            }).code(200);
        }

        // Once you have the user with the email, verify
        // the password hash.
        const match = await Hash.verify(password, user.passwordHash);
        if(match) {
            // Generate a token for subsequent requests.
            const jwt = JWT.sign({
                data: {
                    id: user._id,
                    email: email,
                }
            }, process.env.JWT_SECRET, { expiresIn: '7d' });

            // Update the last login time for the user.
            user.lastLogin = Date.now();
            await user.save();

            return rep.response({
                message: 'Logged in!',
                token: jwt
            }).code(200);
        } else {
            return rep.response({
                message: 'Error: Incorrect password, try again.'
            }).code(200);
        }
    }

}