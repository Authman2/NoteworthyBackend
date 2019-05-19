const firebase = require('firebase');
const admin = require('firebase-admin');

module.exports = class AccountController {

    /** Creates a new Noteworthy account. */
    static async createAccount(email, password, req, rep) {
        try {
            const resp = await firebase.auth().createUserWithEmailAndPassword(email, password);
            return rep.response({
                email,
                uid: resp['user']['uid']
            }).code(200);
        } catch(err) {
            return rep.response(''+err).code(500);
        }
    }

    /** Logs a user into their Noteworthy account. */
    static async login(email, password, token, req, rep) {
        try {
            // Return the user.
            let result;
            if(token && token !== '') {
                result = await firebase.auth().signInWithCustomToken(token);
                return rep.response({
                    email,
                    token: token,
                    uid: result.user.uid
                }).code(200);
            } else {
                result = await firebase.auth().signInWithEmailAndPassword(email, password);
                const _token = await admin.auth().createCustomToken(result.user.uid);
                return rep.response({
                    email,
                    token: _token,
                    uid: result.user.uid
                }).code(200);
            }
        } catch(err) {
            // Return an error.
            return rep.response(''+err).code(500);
        }
    }

    /** Logs the user out of their Noteworthy account. */
    static async logout(req, rep) {
        try {
            await firebase.auth().signOut();
            return rep.response(true).code(200);
        } catch(err) {
            return rep.response(''+err).code(500);
        }
    }

    /** Sends a password reset email to the user. */
    static async forgotPassword(email, req, rep) {
        try {
            await firebase.auth().sendPasswordResetEmail(email);
            return rep.response(true).code(200);
        } catch(err) {
            return rep.response(''+err).code(500);
        }
    }
}