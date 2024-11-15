// routes/notes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const noteController = require('../controllers/noteController');

router.post('/', auth, noteController.createNote);
router.get('/', auth, noteController.getNotes);
router.get('/archived', auth, noteController.getArchivedNotes);
router.get('/:id', auth, noteController.getNoteById);
router.put('/:id', auth, noteController.updateNote);
router.delete('/:id', auth, noteController.deleteNote);
router.post('/search', auth, noteController.searchNotes);
router.put('/:id/archive', auth, noteController.archiveNote);

module.exports = router;