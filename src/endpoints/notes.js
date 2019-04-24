// Notes route. Returns the list of all of the user's
// notes in a given notebook from the database.
const handleGetNotes = (server) => {
    server.route({
        method: 'get',
        path: '/notes',
        handler(req, rep) {
            return {
                notebook: '12345abcde',
                notes: ['these', 'will', 'be', 'notes', 'from', 'a', 'notebook']
            };
        }
    });
}

module.exports = handleGetNotes;