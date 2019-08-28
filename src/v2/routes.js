const createUser = require('./routes/create-user');
const login = require('./routes/login');
const getUser = require('./routes/get-user');

const createNotebook = require('./routes/create-notebook');
const getNotebooks = require('./routes/get-notebooks');
const deleteNotebook = require('./routes/delete-notebook');

const createNote = require('./routes/create-note');
const getNotes = require('./routes/get-notes');
const deleteNote = require('./routes/delete-note');
const saveNote = require('./routes/save');
const moveNote = require('./routes/move');

module.exports = function(server) {
    createUser(server);
    login(server);
    getUser(server);

    createNotebook(server);
    getNotebooks(server);
    deleteNotebook(server);

    createNote(server);
    getNotes(server);
    deleteNote(server);
    saveNote(server);
    moveNote(server);
}