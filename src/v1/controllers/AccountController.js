const firebase = require('firebase');
const admin = require('firebase-admin');
const { verify } = require('./Util');

module.exports = class AccountController {

    /** Creates a new Noteworthy account. */
    static async createAccount(email, password, req, rep) {
        try {
            const resp = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const idToken = await resp.user.getIdToken();
            const customToken = await admin.auth().createCustomToken(resp.user.uid);
            return rep.response({
                email,
                idToken,
                customToken
            }).code(200);
        } catch(err) {
            return rep.response(''+err).code(500);
        }
    }

    /** Logs a user into their Noteworthy account. */
    static async login(email, password, req, rep) {
        try {
            // Return the user.
            let result = await firebase.auth().signInWithEmailAndPassword(email, password);
            const idToken = await result.user.getIdToken();
            const customToken = await admin.auth().createCustomToken(result.user.uid);
            return rep.response({
                email,
                idToken,
                customToken
            }).code(200);
        } catch(err) {
            // Return an error.
            return rep.response(''+err).code(500);
        }
    }

    /** Retrieves your user information from the database. */
    static async getUserInfo(req, rep) {
        try {
            const result = firebase.auth().currentUser;
            return rep.response({
                ...result.toJSON()
            }).code(200);
        } catch(err) {
            return rep.response(''+err).code(500);
        }
    }

    /** Refreshes the session of the current user. */
    static async refresh(token, req, rep) {
        try {
            const result = await firebase.auth().signInWithCustomToken(token);
            const idToken = await result.user.getIdToken();
            const customToken = await admin.auth().createCustomToken(result.user.uid);
            return rep.response({
                email: result.user.email,
                idToken,
                customToken
            }).code(200);
        } catch(err) {
            return rep.response('Too much time has gone by without refreshing. Please log in again to continue.' + err).code(401);
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
            return rep.response({ success: true }).code(200);
        } catch(err) {
            return rep.response(''+err).code(500);
        }
    }
}