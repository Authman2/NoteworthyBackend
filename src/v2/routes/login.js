const Hapi = require('hapi').Server;
const Controller = require('../controllers/User');

module.exports = function(server = new Hapi()) {
    server.route({
        method: 'post',
        path: '/login',
        async handler(req, res) {
            const payload = typeof req.payload === 'string' ? 
                JSON.parse(req.payload) : req.payload;
            return Controller.login(req, res, payload);
        }
    })
}