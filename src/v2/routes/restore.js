const Hapi = require('hapi').Server;
const Controller = require('../controllers/Notebook');

module.exports = function(server = new Hapi()) {
    server.route({
        method: 'post',
        path: '/restore',
        async handler(req, res) {
            const payload = typeof req.payload === 'string' ? 
                JSON.parse(req.payload) : req.payload;
            return Controller.restore(req, res, payload);
        }
    })
}