const Hapi = require('hapi').Server;
const Controller = require('../controllers/Note');

module.exports = function(server = new Hapi()) {
    server.route({
        method: 'delete',
        path: '/delete-note',
        async handler(req, res) {
            const payload = typeof req.payload === 'string' ? 
                JSON.parse(req.payload) : req.payload;
            return Controller.deleteNote(req, res, payload);
        }
    })
}