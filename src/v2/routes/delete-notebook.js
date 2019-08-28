const Hapi = require('hapi').Server;
const Controller = require('../controllers/Notebook');

module.exports = function(server = new Hapi()) {
    server.route({
        method: 'delete',
        path: '/delete-notebook',
        async handler(req, res) {
            const payload = typeof req.payload === 'string' ? 
                JSON.parse(req.payload) : req.payload;
            return Controller.deleteNotebook(req, res, payload);
        }
    })
}