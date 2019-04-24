// Notebooks route. Returns the list of all of the user's
// notebooks from the database.
const handleGetNotebooks = (server) => {
    server.route({
        method: 'get',
        path: '/notebooks',
        handler(req, rep) {
            return ['these', 'will', 'be', 'notebooks'];
        }
    });
}

module.exports = handleGetNotebooks;