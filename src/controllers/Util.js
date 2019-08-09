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
    },


    /** Returns important app information. */
    async getAppInfo() {
        return {
            applicationVersion: '2.0.0',
            copyright: 'Adeola Uthman 2019',
            credits: 'Adeola Uthman',
            version: '2.0.0',
            website: 'https://adeolauthman.com/noteworthy'
        }
    }
}