const Note = require('../models/Note');

// Create a new note
exports.createNote = async (req, res) => {
    try {
        const newNote = new Note({
            user: req.user.id,
            title: req.body.title,
            content: req.body.content,
            tags: req.body.tags,
            theme: req.body.theme, // Capture the theme details
        });
        const note = await newNote.save();
        res.json(note);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Get all notes for a user
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Get archived notes
exports.getArchivedNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id, isArchived: true });
        res.json(notes);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Get a note by its ID
exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note || note.user.toString() !== req.user.id) {
            return res.status(404).json({ msg: 'Note not found' });
        }
        res.json(note);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Update a note
exports.updateNote = async (req, res) => {
    const { title, content, tags, theme } = req.body;

    // Build note object
    const noteFields = {};
    if (title) noteFields.title = title;
    if (content) noteFields.content = content;
    if (tags) noteFields.tags = tags;
    if (theme) noteFields.theme = theme;

    try {
        let note = await Note.findById(req.params.id);

        if (!note) return res.status(404).json({ msg: 'Note not found' });

        // Make sure user owns note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        note = await Note.findByIdAndUpdate(
            req.params.id,
            { $set: noteFields },
            { new: true }
        );

        res.json(note);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Delete a note
exports.deleteNote = async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);

        if (!note) return res.status(404).json({ msg: 'Note not found' });

        // Make sure user owns note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Note.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Note removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Archive a note
exports.archiveNote = async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);

        if (!note) return res.status(404).json({ msg: 'Note not found' });

        // Make sure user owns note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        note.isArchived = true;
        await note.save();

        res.json(note);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Search notes
exports.searchNotes = async (req, res) => {
    const { query } = req.query;
    try {
        const notes = await Note.find({
            user: req.user.id,
            $text: { $search: query }
        });
        res.json(notes);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};