const firebase = require('firebase');
const Moment = require('moment');

// Handles creating a new note in the database
// under the currently logged in user.
const handleCreateNote = (server) => {
    server.route({
        method: 'post',
        path: '/create-note',
        
        async handler(req, rep) {
            // Get the current user.
            const params = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const uid = params.uid;
            if(!uid) return rep.response('No user is currently logged in, so a note could not be created.').code(400);

            // Get the data needed to populate the note.
            const data = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
            const { title, content, notebookID } = data;
            const now = new Moment();
            const saveDate = [now.year(), now.month(), now.day(), now.hours(), now.minutes(), now.seconds()];

            // Create the new document.
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
    });
}

module.exports = handleCreateNote;