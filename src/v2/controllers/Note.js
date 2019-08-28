const JWT = require('jsonwebtoken');
const { Note, openDB } = require('../schemas');

module.exports = {

    // Creates a new note under a particular notebook.
    createNote: async function(req, rep, { title, content, notebookID, token }) {
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
            }).code(200);
        }
    },


    // Returns all of the notes under a given notebook.
    getNotes: async function(req, rep, { notebookID, token }) {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        if(decoded && decoded.data) {
            await openDB('NoteInfo');

            const nts = await Note.find({ notebookID });
            return rep.response(nts).code(200);
        } else {
            return rep.response({
                message: `Error: Not authorized.`
            }).code(200);
        }
    },

    // Deletes a note from the databse.
    deleteNote: async function(req, rep, { id, token }) {
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
            }).code(200);
        }
    }

}