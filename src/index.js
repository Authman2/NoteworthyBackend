require('./v2/schemas');
const Hapi = require('hapi').Server;
const routes = require('./v2/routes');

// Create the api server.
const server = new Hapi({
    port: process.env.PORT || 8000,
    routes: {
        cors: {
            origin: [
                'http://localhost:3000', 
                'http://localhost:3000/login',
                'https://noteworthyapp.netlify.com',
                'https://dev-noteworthyapp.netlify.com'
            ]
        }
    }
});

// Route handlers.
server.route({
    method: 'GET',
    path: '/',
    handler() {
        return `<h1>Noteworthy Backend!!!</h1>`;
    }
});
routes(server);

// Start the server.
const init = async () => {
    await server.start();
    console.log(`Started API server on port ${server.info.port}!`);
}
init();