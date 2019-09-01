const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const { User, openDB } = require('../schemas');

module.exports = {

    // Creates a new user in the database.
    createUser: async function(req, rep, { firstName, lastName, email, password }) {
        await openDB('UserInfo');

        const salt = await bcrypt.genSalt();
        const passwordHash = bcrypt.hashSync(password, salt);
        const usr = new User({
            firstName,
            lastName,
            email,
            passwordHash,
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
            }).code(401);
        }

        // Once you have the user with the email, verify
        // the password hash.
        const match = await bcrypt.compare(password, user.passwordHash);
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
            }).code(401);
        }
    },


    // Returns information about the currently logged in user.
    getUser: async function(req, rep, {}) {
        const token = req.headers.token;
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        if(decoded && decoded.data) {
            await openDB('UserInfo');

            const user = await User.findOne({ _id: decoded.data.id });
            if(!user) return rep.response({ message: "Could not find the current user" }).code(404);

            const {
                _id, firstName, lastName,
                email, created, lastLogin
            } = user;
            return rep.response({
                _id, firstName, lastName,
                email, created, lastLogin
            }).code(200);
        } else {
            return rep.response({
                message: `Error: Not authorized.`
            }).code(401);
        }
    }

}