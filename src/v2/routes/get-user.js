const Hapi = require('hapi').Server;
const Controller = require('../controllers/User');

module.exports = function(server = new Hapi()) {
    server.route({
        method: 'get',
        path: '/get-user',
        async handler(req, res) {
            const payload = typeof req.query === 'string' ? 
                JSON.parse(req.query) : req.query;
            return Controller.getUser(req, res, payload);
        }
    })
}