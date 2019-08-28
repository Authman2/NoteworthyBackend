const Hapi = require('hapi').Server;
const Controller = require('../controllers/Notebook');

module.exports = function(server = new Hapi()) {
    server.route({
        method: 'post',
        path: '/create-notebook',
        async handler(req, res) {
            const payload = typeof req.payload === 'string' ? 
                JSON.parse(req.payload) : req.payload;
            return Controller.createNotebook(req, res, payload);
        }
    })
}