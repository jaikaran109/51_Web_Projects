const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String,
        trim: true
    },

    desc: {
        required: true,
        type: String,
        trim: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const notes = mongoose.model('notes', noteSchema);

module.exports = notes;