const Hapi = require('hapi').Server;
const firebase = require('firebase');
const admin = require('firebase-admin');

const LoginRoute = require('./src/endpoints/login');
const LogoutRoute = require('./src/endpoints/logout');
const CreateAccountRoute = require('./src/endpoints/create-account');
const NotebooksRoute = require('./src/endpoints/notebooks');
const NotesRoute = require('./src/endpoints/notes');
const CreateNotebookRoute = require('./src/endpoints/create-notebook');
const CreateNoteRoute = require('./src/endpoints/create-note');
const SaveRoute = require('./src/endpoints/save');
const DeleteNotebookRoute = require('./src/endpoints/delete-notebook');
const DeleteNoteRoute = require('./src/endpoints/delete-note');
const MoveNoteRoute = require('./src/endpoints/move-note');

// Initialize firebase.
const options = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messageSenderId,
};
const serviceAccount = require('./serviceAccountKey.json');
firebase.initializeApp(options);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.databaseURL
});

// Create the api server.
const server = new Hapi({
    port: process.env.PORT || 8000,
});
const auth = firebase.auth();
const database = firebase.database().ref();

// Define the routes.
LoginRoute(server, auth, admin);
LogoutRoute(server, auth);
CreateAccountRoute(server, auth);
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