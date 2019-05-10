const firebase = require('firebase');

// Notebooks route. Returns the list of all of the user's
// notebooks from the database.
const handleGetNotebooks = (server) => {
    server.route({
        method: 'get',
        path: '/notebooks',
        
        async handler(req, rep) {
            // Get the currently logged in user.
            const params = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const uid = params.uid;
            if(!uid) return rep.response('No user is currently logged in, so no notebooks were recevied.').code(400);

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
    });
}

module.exports = handleGetNotebooks;