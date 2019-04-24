// Notes route. Returns the list of all of the user's
// notes in a given notebook from the database.
const handleGetNotes = (server, fireAuth, fireRef) => {
    server.route({
        method: 'get',
        path: '/notes',
        async handler(req, rep) {
            // Get the currently logged in user.
            const cUser = fireAuth.currentUser;
            if(!cUser) return rep.response('No user is currently logged in, so no notebooks were recevied.').code(400);

            // We also need the id of the notebook to look for notes in.
            const notebookID = req.query['notebookID'];

            // Now that you have the current user and the notebook id, return the
            // list of notes under that notebook.
            try {
                const data = (await fireRef.orderByKey().equalTo(cUser.uid).once('value')).val();
                const everything = Object.values(data[cUser.uid]);
                const notes = everything.filter(val => val.notebook === notebookID);
                return rep.response({
                    notes,
                    notebookID: notebookID
                }).code(200);
            } catch(err) {
                return rep.response(''+err).code(500);
            }
        }
    });
}

module.exports = handleGetNotes;