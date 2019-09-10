const Hapi = require('hapi').Server;
const Controller = require('../controllers/Note');

module.exports = function(server = new Hapi()) {
    server.route({
        method: 'get',
        path: '/get-favorites',
        async handler(req, res) {
            const payload = typeof req.query === 'string' ? 
                JSON.parse(req.query) : req.query;
            return Controller.getFavorites(req, res, payload);
        }
    })
}