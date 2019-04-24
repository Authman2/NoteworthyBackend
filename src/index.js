const Hapi = require('hapi').Server;

const LoginRoute = require('./endpoints/login');
const LogoutRoute = require('./endpoints/logout');
const NotebooksRoute = require('./endpoints/notebooks');
const NotesRoute = require('./endpoints/notes');

// Create the api server.
const server = new Hapi({
    port: process.env.PORT || 8000
});

// Define the routes.
LoginRoute(server);
LogoutRoute(server);
NotebooksRoute(server);
NotesRoute(server);

// Start the server.
const init = async () => await server.start();
init();