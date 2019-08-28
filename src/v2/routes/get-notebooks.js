const Hapi = require('hapi').Server;
const Controller = require('../controllers/Notebook');

module.exports = function(server = new Hapi()) {
    server.route({
        method: 'get',
        path: '/get-notebooks',
        async handler(req, res) {
            const payload = typeof req.query === 'string' ? 
                JSON.parse(req.query) : req.query;
            return Controller.getNotebooks(req, res, payload);
        }
    })
}