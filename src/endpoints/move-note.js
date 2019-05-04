const firebase = require('firebase');

// Route that handles moving a note from one notebook to another.
const handleMoveNote = (server, fireAuth, fireRef) => {
    server.route({
        method: 'put',
        path: '/move-note',
        async handler(req, rep) {
            // Get the currently logged in user.
            const params = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const uid = params.uid;
            if(!uid) return rep.response('No user is currently logged in, so no notebooks were recevied.').code(400);

            // Get the noteID, the notebookID to move it from and the
            // notebookID to move it to.
            const data = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
            const { noteID, fromNotebook, toNotebook } = data;

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
    })
}

module.exports = handleMoveNote;