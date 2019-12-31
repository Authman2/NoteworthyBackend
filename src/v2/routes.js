const createUser = require('./routes/create-user');
const login = require('./routes/login');
const getUser = require('./routes/get-user');
const updateSettings = require('./routes/update-settings');

const createNotebook = require('./routes/create-notebook');
const getNotes = require('./routes/get-notes');
const getNotebooks = require('./routes/get-notebooks');
const deleteNotebook = require('./routes/delete-notebook');
const restore = require('./routes/restore');

const createNote = require('./routes/create-note');
const deleteNote = require('./routes/delete-note');
const saveNote = require('./routes/save');
const moveNote = require('./routes/move');
const favoriteNote = require('./routes/favorite');
const getFavorites = require('./routes/get-favorites');

module.exports = function(server) {
    createUser(server);
    login(server);
    getUser(server);
    updateSettings(server);

    createNotebook(server);
    getNotes(server);
    getNotebooks(server);
    deleteNotebook(server);
    restore(server);

    createNote(server);
    deleteNote(server);
    saveNote(server);
    moveNote(server);
    favoriteNote(server);
    getFavorites(server);
}