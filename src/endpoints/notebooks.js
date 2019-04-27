// Notebooks route. Returns the list of all of the user's
// notebooks from the database.
const handleGetNotebooks = (server, fireAuth, fireRef) => {
    server.route({
        method: 'get',
        path: '/notebooks',
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        async handler(req, rep) {
            // Get the currently logged in user.
            const payload = typeof req.params === 'string' ? JSON.parse(req.params) : req.params;
            const cUser = payload['cUser'];
            if(!cUser) return rep.response('No user is currently logged in, so no notebooks were recevied.').code(400);

            // Now that you have the current user, find the notebooks in
            // the firebase database.
            try {
                const data = (await fireRef.orderByKey().equalTo(cUser.uid).once('value')).val();
                const everything = Object.values(data[cUser.uid]);
                const notebooks = everything.filter(val => val.pages);
                return rep.response(notebooks).code(200);
            } catch(err) {
                return rep.response(''+err).code(500);
            }
        }
    });
}

module.exports = handleGetNotebooks;