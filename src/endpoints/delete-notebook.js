const firebase = require('firebase');

// The route for deleting a single notebook.
const handleDeleteNotebook = (server, fireAuth, fireRef) => {
    server.route({
        method: 'delete',
        path: '/delete-notebook',
        async handler(req, rep) {
            // Get the currently logged in user.
            const cUser = fireAuth.currentUser;
            if(!cUser) return rep.response('No user is currently logged in, so no notebooks were recevied.').code(400);

            // Get the ID of the notebook you are trying to delete.
            const data = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
            const { notebookID } = data;
            
            // Find all of the notes in the database that are part of this notebook.
            const database = (await fireRef.orderByKey().equalTo(cUser.uid).once('value')).val();
            const everything = Object.values(database[cUser.uid]);
            const notes = everything.filter(val => val.notebook && val.notebook === notebookID);
            
            // Go through each note, and delete it one by one.
            notes.forEach(async note => {
                const ref = firebase.database().ref(`/${cUser.uid}/${note.id}`);
                try { await ref.remove(); } catch(err) { console.warn(`Note: ${note.id} was not deleted.`); }
            });

            // Finish deleting the notebook.
            const notebookRef = firebase.database().ref(`/${cUser.uid}/${notebookID}`);
            
            if(!notebookRef) return rep.response('Notebook was not found, so not deleted.').code(200);
            try {
                await notebookRef.remove();
                return true;
            } catch(err) {
                return rep.response(''+err).code(500);
            }
        }
    });
}

module.exports = handleDeleteNotebook;