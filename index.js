const Hapi = require('hapi').Server;
const firebase = require('firebase');
const admin = require('firebase-admin');

const LoginRoute = require('./src/login');
const LogoutRoute = require('./src/logout');
const CreateAccountRoute = require('./src/create-account');
const NotebooksRoute = require('./src/notebooks');
const NotesRoute = require('./src/notes');
const CreateNotebookRoute = require('./src/create-notebook');
const CreateNoteRoute = require('./src/create-note');
const SaveRoute = require('./src/save');
const SaveNotebookRoute = require('./src/saveNotebook');
const DeleteNotebookRoute = require('./src/delete-notebook');
const DeleteNoteRoute = require('./src/delete-note');
const MoveNoteRoute = require('./src/move-note');
const ForgotPassword = require('./src/forgot-password');

// Initialize firebase.
const options = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messageSenderId,
};
const serviceAccount = {
    "type": process.env.type,
    "project_id": process.env.project_id,
    "private_key_id": process.env.private_key_id,
    "private_key": process.env.private_key.replace(/\\n/g, '\n'),
    "client_email": process.env.client_email,
    "client_id": process.env.client_id,
    "auth_uri": process.env.auth_uri,
    "token_uri": process.env.token_uri,
    "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
    "client_x509_cert_url": process.env.client_x509_cert_url
}

firebase.initializeApp(options);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.databaseURL
});

// Create the api server.
const server = new Hapi({
    port: process.env.PORT || 8000,
    routes: {
        cors: {
            credentials: true,
            origin: ['http://localhost:3000', 'https://noteworthyapp.netlify.com']
        }
    }
});
// Define the routes.
LoginRoute(server, admin);
LogoutRoute(server);
CreateAccountRoute(server);
NotebooksRoute(server);
NotesRoute(server);
CreateNotebookRoute(server);
CreateNoteRoute(server);
SaveRoute(server);
SaveNotebookRoute(server);
DeleteNotebookRoute(server);
DeleteNoteRoute(server);
MoveNoteRoute(server);
ForgotPassword(server);
// server.route({
//     method: 'GET',
//     path: '/',
//     handler() {
//         return `<h1>Noteworthy Backend!!!</h1>`;
//     }
// })

// Start the server.
const init = async () => {
    await server.start();
    console.log('Started API server!');
}
init();