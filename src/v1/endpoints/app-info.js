const Util = require('../controllers/Util');

// Returns app information to the user.
const handleGetAppInfo = (server) => {
    server.route({
        method: 'get',
        path: '/app-info',
        
        async handler(req, rep) {
            return rep.response(await Util.getAppInfo()).code(200);
        }
    });
}

module.exports = handleGetAppInfo;