const admin = require('firebase-admin');

module.exports = {

    /** Checks if the user's token is valid. */
    async verify(token) {
        try {
            const result = await admin.auth().verifyIdToken(token);
            return result;
        } catch(err) {
            return undefined;
        }
    }
}