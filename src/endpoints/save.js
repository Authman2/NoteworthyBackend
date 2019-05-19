const NoteController = require('../controllers/NoteController');

// Saves the most recent version of the current note to the database.
const handleSave = (server) => {
    server.route({
        method: 'post',
        path: '/save',
        async handler(req, rep) {
            // Get the current user.
            const params = typeof req.query === 'string' ? JSON.parse(req.query) : req.query;
            const uid = params['uid'];
            if(!uid) {
                return rep.response('No user is currently logged in, so the note could not be saved.').code(400);
            }

            // Get the list of notebooks and notes all together.
            const data = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
            const { noteID, title, content } = data;
            return NoteController.save(uid, noteID, title, content, req, rep);
        }
    });
}

module.exports = handleSave;