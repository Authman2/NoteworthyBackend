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
server.route({
    method: 'GET',
    path: '/app-info',
    handler() {
        return {
            applicationVersion: '2.0.0',
            copyright: 'Adeola Uthman 2019',
            credits: 'Adeola Uthman',
            version: '2.0.0',
            website: 'https://adeolauthman.com/noteworthy'
        }
    }
})
routes(server);

// Start the server.
const init = async () => {
    await server.start();
    console.log(`Started API server on port ${server.info.port}!`);
}
init();