const mongoose = require('mongoose');

// Define schemes for all database structures.
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true,
    },
    created: {
        type: Number,
        required: true
    },
    lastLogin: {
        type: Number,
        required: true
    }
});
const NotebookSchema = new mongoose.Schema({
    created: {
        type: Number,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    }
});
const NoteSchema = new mongoose.Schema({
    created: {
        type: Number,
        required: true,
    },
    modified: {
        type: Number,
        required: true
    },
    userID: {
        type: String,
        required: true,
    },
    notebookID: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    }
})

// Create modals for the schemas.
const User = mongoose.model('User', UserSchema, 'Users');
const Notebook = mongoose.model('Notebook', NotebookSchema, 'Notebooks');
const Note = mongoose.model('Note', NoteSchema, 'Notes');

// Connect to MongoDB.
async function openDB(dbName = 'UserInfo', then) {
    const pass = process.env.MONGO_ADMIN_PASS;
    const res = await mongoose.connect(`mongodb+srv://authman2:${pass}@noteworthycluster-5cxoh.azure.mongodb.net/test?retryWrites=true&w=majority`, {
        dbName: dbName,
        useFindAndModify: false
    })
    console.log(`Connection to "${dbName}" database status: ${res}`);
    if(then) then();
}
openDB('UserInfo');
module.exports = {
    openDB,
    User,
    Notebook,
    Note
};