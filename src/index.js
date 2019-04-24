const Hapi = require('hapi').Server;
const firebase = require('firebase');

const LoginRoute = require('./endpoints/login');
const LogoutRoute = require('./endpoints/logout');
const NotebooksRoute = require('./endpoints/notebooks');
const NotesRoute = require('./endpoints/notes');

// Initialize firebase.
firebase.initializeApp({
    apiKey: process.env['apiKey'],
    authDomain: process.env['authDomain'],
    databaseURL: process.env['databaseURL'],
    projectId: process.env['projectId'],
    storageBucket: process.env['storageBucket'],
    messagingSenderId: process.env['messageSenderId'],
});

// Create the api server.
const server = new Hapi({
    port: process.env.PORT || 8000
});
const auth = firebase.auth();
const database = firebase.database().ref();

// Define the routes.
LoginRoute(server, auth);
LogoutRoute(server, auth);
NotebooksRoute(server, auth, database);
NotesRoute(server, auth, database);

// Start the server.
const init = async () => await server.start();
init();