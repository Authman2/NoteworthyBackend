const Hapi = require('hapi').Server;
const firebase = require('firebase');

const LoginRoute = require('./endpoints/login');
const LogoutRoute = require('./endpoints/logout');
const NotebooksRoute = require('./endpoints/notebooks');
const NotesRoute = require('./endpoints/notes');
const CreateNotebookRoute = require('./endpoints/create-notebook');
const CreateNoteRoute = require('./endpoints/create-note');
const SaveRoute = require('./endpoints/save');
const DeleteNotebookRoute = require('./endpoints/delete-notebook');
const DeleteNoteRoute = require('./endpoints/delete-note');
const MoveNoteRoute = require('./endpoints/move-note');

// Initialize firebase.
firebase.initializeApp({
    apiKey: ''+process.env['apiKey'],
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
CreateNotebookRoute(server, auth, database);
CreateNoteRoute(server, auth, database);
SaveRoute(server, auth, database);
DeleteNotebookRoute(server, auth, database);
DeleteNoteRoute(server, auth, database);
MoveNoteRoute(server, auth, database);

// Start the server.
const init = async () => {
    await server.start();
    console.log('Started server!');
}
init();