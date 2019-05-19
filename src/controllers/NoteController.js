const firebase = require('firebase');
const { verify } = require('./Util');

module.exports = class NoteController {

    /** Retrieves the list of notes in a given notebook. */
    static async get(token, notebookID, req, rep) {
        const verified = await verify(token);
        if(!verified) return rep.response('Could not verify the current user.').code(500);
        const uid = verified.uid;

        // Now that you have the current user and the notebook id, return the
        // list of notes under that notebook.
        try {
            const data = (await firebase.database().ref().orderByKey().equalTo(uid).once('value')).val();
            const everything = Object.values(data[uid]);
            const notes = everything.filter(val => val.notebook === notebookID);
            return rep.response({
                notes,
                notebookID: notebookID
            }).code(200);
        } catch(err) {
            return rep.response(''+err).code(500);
        }
    }

    /** Creates a new note in the database under a notebook. */
    static async createNote(token, title, content, notebookID, req, rep) {
        const verified = await verify(token);
        if(!verified) return rep.response('Could not verify the current user.').code(500);
        const uid = verified.uid;

        // Create the new document.
        const saveDate = Date.now();
        const newNote = {
            title,
            content,
            created: saveDate,
            notebook: notebookID,
        }

        // Save the item into the database.
        const fireRef = firebase.database().ref();
        try {
            // Save a new note in place.
            const ref = fireRef.child(uid).push();
            const obj = {
                ...newNote,
                id: ref.key
            }
            await ref.set(obj);

            // Update the notebook so that it references this newly added note.
            try {
                await fireRef.child(uid).child(notebookID).once('value', snap => {
                    const notebook = snap.val();
                    if(notebook.pages) {
                        fireRef.child(uid).child(notebookID).set({ ...notebook, pages: notebook.pages.concat(obj.id) });
                    } else {
                        fireRef.child(uid).child(notebookID).set({ ...notebook, pages: [obj.id] });
                    }
                });
                return rep.response(obj).code(200);
            } catch(err) {
                return rep.response(''+err).code(500);
            }
        } catch(err) {
            return rep.response(''+err).code(500);
        }
    }

    /** Deletes a note in the database and removes it from its notebook. */
    static async delete(token, noteID, req, rep) {
        const verified = await verify(token);
        if(!verified) return rep.response('Could not verify the current user.').code(500);
        const uid = verified.uid;

        // Find the note in the database.
        const fireRef = firebase.database().ref();
        const ref = firebase.database().ref(`/${uid}/${noteID}`);

        // Remove the note from its notebook.
        const database = (await fireRef.orderByKey().equalTo(uid).once('value')).val();
        const everything = Object.values(database[uid]);
        const notebooks = everything.filter(val => val.pages);
        
        // Go through each note, and delete it one by one.
        notebooks.forEach(async notebook => {
            await fireRef.child(uid).child(notebook.id).once('value', snap => {
                const notebook = snap.val();
                if(!notebook.pages) return;
                
                const index = notebook.pages.indexOf(noteID);
                if(index >= 0) {
                    notebook.pages.splice(index, 1);
                    fireRef.child(uid).child(notebook.id).set({ ...notebook, pages: notebook.pages });
                }
            });
        });
        
        // Delete the note from the database.
        if(!ref) return rep.response('Note couldn\'t be found, so it was not deleted.').code(200);
        try {
            await ref.remove();
            return true;
        } catch(err) {
            return rep.response(''+err).code(500);
        }
    }

    /** Moves a note from one notebook to another. */
    static async move(token, noteID, fromNotebook, toNotebook, req, rep) {
        const verified = await verify(token);
        if(!verified) return rep.response('Could not verify the current user.').code(500);
        const uid = verified.uid;

        const fireRef = firebase.database().ref();

        // Go into the new notebook and add the noteID to its pages.
        try {
            const notebook = (await fireRef.child(uid).child(toNotebook).once('value')).val();
            fireRef.child(uid).child(toNotebook).set({ ...notebook, pages: notebook.pages.concat(noteID) });
        } catch(err) {
            return rep.response('There was a problem moving the note to the new notebook: ' + err).code(500);
        }

        // Delete the note from the old notebook's pages.
        try {
            const oldNotebook = (await fireRef.child(uid).child(fromNotebook).once('value')).val();
            const index = oldNotebook.pages.indexOf(noteID);
            if(index >= 0) {
                oldNotebook.pages.splice(index, 1);
                fireRef.child(uid).child(fromNotebook).set({ ...oldNotebook, pages: oldNotebook.pages });
            }
        } catch(err) {
            return rep.response('There was a problem deleting the note from the old notebook: ' + err).code(500);
        }

        // Update the note so that its notebook property points to the new one.
        try {
            const note = (await fireRef.child(uid).child(noteID).once('value')).val();
            fireRef.child(uid).child(noteID).set({ ...note, notebook: toNotebook });
        } catch(err) {
            return rep.response('There was a problem moving the note to the new notebook: ' + err).code(500);
        }

        // Return the good response.
        return rep.response('Moved note!').code(200);
    }

    /** Saves a note to the database. */
    static async save(token, noteID, title, content, req, rep) {
        const verified = await verify(token);
        if(!verified) return rep.response('Could not verify the current user.').code(500);
        const uid = verified.uid;
        
        // Save the entire structure to the database.
        try {
            const old = (await firebase.database().ref().child(uid).child(noteID).once('value')).val();
            const saved = { ...old, title, content };
            
            try {
                await firebase.database().ref().child(uid).child(noteID).set(saved);
                return rep.response('Saved!').code(200);
            } catch(err) {
                return rep.response(''+err).code(500);
            }
        } catch(err) {
            return rep.response(''+err).code(500);
        }
    }
}