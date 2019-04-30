// Notes route. Returns the list of all of the user's
// notes in a given notebook from the database.
const handleGetNotes = (server, fireAuth, fireRef) => {
    server.route({
        method: 'get',
        path: '/notes',
        options: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        async handler(req, rep) {
            // Get the currently logged in user.
            const params = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const uid = params.uid;
            if(!uid) return rep.response('No user is currently logged in, so no notebooks were recevied.').code(400);

            // We also need the id of the notebook to look for notes in.
            const notebookID = params['notebookID'];

            // Now that you have the current user and the notebook id, return the
            // list of notes under that notebook.
            try {
                const data = (await fireRef.orderByKey().equalTo(uid).once('value')).val();
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
    });
}

module.exports = handleGetNotes;