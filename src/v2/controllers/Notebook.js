const JWT = require('jsonwebtoken');
const { Notebook, Note, openDB } = require('../schemas');

module.exports = {

    // Creates a new notebook in the database.
    createNotebook: async function(req, rep, { title, id }) {
        const token = req.headers.authorization;
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        if(decoded && decoded.data) {
            await openDB('NotebookInfo');

            const nb = new Notebook({
                created: Date.now(),
                userID: decoded.data.id,
                title,
                id
            });
            await nb.save();
            return rep.response({
                    message: `Created new notebook called ${title}!`
                }).code(200);
        } else {
            return rep.response({
                    message: `Error: Not authorized.`
                }).code(401);
        }
    },


    // Returns all of the notebooks for the current user in the database.
    getNotebooks: async function(req, rep, {}) {
        const token = req.headers.authorization;
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        if(decoded && decoded.data) {
            await openDB('NotebookInfo');

            const userID = decoded.data.id;
            const nbs = await Notebook.find({ userID });
            return rep.response(nbs).code(200);
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

    // Deletes a notebook and all of the notes associated with it.
    deleteNotebook: async function(req, rep, { id }) {
        const token = req.headers.authorization;
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        if(decoded && decoded.data) {
            await openDB('NotebookInfo');

            // Find the notebook with the id you are trying to delete.
            const nb = await Notebook.findOne({ id: id });
            if(nb) {
                nb.remove();
                await openDB('NoteInfo');

                // Find all of the notes under this notebook.
                const notes = await Note.find({ notebookID: id });
                notes.forEach(note => note.remove());

                return rep.response({
                    message: `Deleted the notebook ${nb.title} and all of its notes.`
                }).code(200);
            } else {
                return rep.response({
                    message: "Error: Could not find the notebook your are trying to delete."
                }).code(404);
            }
        } else {
            return rep.response({
                message: `Error: Not authorized.`
            }).code(401);
        }
    }

}