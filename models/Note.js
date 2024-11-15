// models/Note.js
const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    tags: [String],
    isArchived: {
        type: Boolean,
        default: false,
    },
    theme: {
        color: String,
        font: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

NoteSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Note', NoteSchema);