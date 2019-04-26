const firebase = require('firebase');

// The route for deleting a single note.
const handleDeleteNote = (server, fireAuth, fireRef) => {
    server.route({
        method: 'delete',
        path: '/delete-note',
        async handler(req, rep) {
            // Get the currently logged in user.
            const cUser = fireAuth.currentUser;
            if(!cUser) return rep.response('No user is currently logged in, so no notebooks were recevied.').code(400);

            // Get the ID of the note you are trying to delete.
            const data = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
            const { noteID } = data;
            
            // Find the note in the database.
            const ref = firebase.database().ref(`/${cUser.uid}/${noteID}`);

            // Remove the note from its notebook.
            const database = (await fireRef.orderByKey().equalTo(cUser.uid).once('value')).val();
            const everything = Object.values(database[cUser.uid]);
            const notebooks = everything.filter(val => val.pages);
            
            // Go through each note, and delete it one by one.
            notebooks.forEach(async notebook => {
                await fireRef.child(cUser.uid).child(notebook.id).once('value', snap => {
                    const notebook = snap.val();
                    if(!notebook.pages) return;
                    
                    const index = notebook.pages.indexOf(noteID);
                    if(index >= 0) {
                        notebook.pages.splice(index, 1);
                        fireRef.child(cUser.uid).child(notebook.id).set({ ...notebook, pages: notebook.pages });
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
    });
}

module.exports = handleDeleteNote;