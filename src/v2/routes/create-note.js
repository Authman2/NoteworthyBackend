const Hapi = require('hapi').Server;
const Controller = require('../controllers/Note');

module.exports = function(server = new Hapi()) {
    server.route({
        method: 'post',
        path: '/create-note',
        async handler(req, res) {
            const payload = typeof req.payload === 'string' ? 
                JSON.parse(req.payload) : req.payload;
            return Controller.createNote(req, res, payload);
        }
    })
}