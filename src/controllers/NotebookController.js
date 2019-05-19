const firebase = require('firebase');
const { verify } = require('./Util');

module.exports = class NotebookController {

    /** Retrieves a list of the user's notebooks. */
    static async get(token, req, rep) {
        const verified = await verify(token);
        if(!verified) return rep.response('Could not verify the current user.').code(500);
        const uid = verified.uid;

        // Now that you have the current user, find the notebooks in
        // the firebase database.
        try {
            const data = (await firebase.database().ref().orderByKey().equalTo(uid).once('value')).val();
            const everything = Object.values(data[uid]);
            const notebooks = everything.filter(val => !val.notebook);
            return rep.response(notebooks).code(200);
        } catch(err) {
            return rep.response(''+err).code(500);
        }
    }

    /** Creates a new notebook in the database. */
    static async createNotebook(token, title, req, rep) {
        const verified = await verify(token);
        if(!verified) return rep.response('Could not verify the current user.').code(500);
        const uid = verified.uid;

        // Create a new document for the notebook.
        const saveDate = Date.now();
        const newObj = {
            title,
            created: saveDate,
            pages: [],
            creator: uid
        }

        // Save the item into the database.
        try {
            const ref = firebase.database().ref().child(uid).push();
            const obj = {
                ...newObj,
                id: ref.key
            }
            await ref.set(obj);
            return rep.response(obj).code(200);
        } catch(err) {
            return rep.response(''+err).code(500);
        }
    }

    /** Deletes a notebook and all of its notes. */
    static async delete(token, notebookID, req, rep) {
        const verified = await verify(token);
        if(!verified) return rep.response('Could not verify the current user.').code(500);
        const uid = verified.uid;
        const fireRef = firebase.database().ref();

        // Find all of the notes in the database that are part of this notebook.
        const database = (await fireRef.orderByKey().equalTo(uid).once('value')).val();
        const everything = Object.values(database[uid]);
        const notes = everything.filter(val => val.notebook && val.notebook === notebookID);
        
        // Go through each note, and delete it one by one.
        notes.forEach(async note => {
            const ref = firebase.database().ref(`/${uid}/${note.id}`);
            try { await ref.remove(); } catch(err) { console.warn(`Note: ${note.id} was not deleted.`); }
        });

        // Finish deleting the notebook.
        const notebookRef = firebase.database().ref(`/${uid}/${notebookID}`);
        
        if(!notebookRef) return rep.response('Notebook was not found, so not deleted.').code(200);
        try {
            await notebookRef.remove();
            return true;
        } catch(err) {
            return rep.response(''+err).code(500);
        }
    }
}