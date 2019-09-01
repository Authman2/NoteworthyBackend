const JWT = require('jsonwebtoken');
const { Note, Notebook, openDB } = require('../schemas');

module.exports = {

    // Creates a new note under a particular notebook.
    createNote: async function(req, rep, { title, content, notebookID }) {
        const token = req.headers.authorization;
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        if(decoded && decoded.data) {
            await openDB('NoteInfo');

            const n = new Note({
                created: Date.now(),
                modified: Date.now(),
                userID: decoded.data.id,
                notebookID,
                content,
                title,
            });
            await n.save();
            return rep.response({
                message: `Created a new note called ${title}!`
            }).code(200);
        } else {
            return rep.response({
                message: `Error: Not authorized.`
            }).code(401);
        }
    },


    // Returns all of the notes under a given notebook.
    getNotes: async function(req, rep, { notebookID }) {
        const token = req.headers.authorization;
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        if(decoded && decoded.data) {
            await openDB('NoteInfo');

            const nts = await Note.find({ notebookID });
            return rep.response(nts).code(200);
        } else {
            return rep.response({
                message: `Error: Not authorized.`
            }).code(401);
        }
    },


    // Deletes a note from the databse.
    deleteNote: async function(req, rep, { id }) {
        const token = req.headers.authorization;
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        if(decoded && decoded.data) {
            await openDB('NoteInfo');

            // Find the note with the id you are trying to delete.
            const note = await Note.findOneAndRemove({ _id: id });
            return rep.response({
                message: `Deleted the note ${note.title}`
            }).code(200);
        } else {
            return rep.response({
                message: `Error: Not authorized.`
            }).code(401);
        }
    },


    // Saves the newest version of the note to the database.
    save: async function(req, rep, { id, title, content }) {
        const token = req.headers.authorization;
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        if(decoded && decoded.data) {
            await openDB('NoteInfo');

            // Find the note with the id you are trying to update.
            await Note.findOneAndUpdate({ _id: id }, {
                title, content,
                modified: Date.now()
            });
            return rep.response({ message: `Saved!` }).code(200);
        } else {
            return rep.response({
                message: `Error: Not authorized.`
            }).code(401);
        }
    },


    // Moves a note from one notebook to another.
    move: async function(req, rep, { id, fromNotebook, toNotebook }) {
        const token = req.headers.authorization;
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        if(decoded && decoded.data) {
            await openDB('NotebookInfo');

            // Get the names of the two notebooks.
            const oldNotebook = await Notebook.findOne({ _id: fromNotebook });
            const newNotebook = await Notebook.findOne({ _id: toNotebook });

            if(!oldNotebook || !newNotebook) {
                return rep.response({
                    message: "Error: Could not find the notebooks you are trying to move between."
                }).code(404);
            }

            // Find the note and just update its notebook ID.
            await openDB('NoteInfo');
            const note = await Note.findOneAndUpdate({ _id: id }, { notebookID: toNotebook });
            
            return rep.response({
                message: `Moved "${note.title}" from "${oldNotebook.title}" to "${newNotebook.title}"`
            }).code(200);
        } else {
            return rep.response({
                message: `Error: Not authorized.`
            }).code(401);
        }
    }

}