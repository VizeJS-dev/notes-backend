const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const auth = require('../middleware/auth');

router.post('/', auth, noteController.createNote);
router.get('/', auth, noteController.getNotes);
router.get('/archived', auth, noteController.getArchivedNotes);
router.get('/:id', auth, noteController.getNoteById);
router.put('/:id', auth, noteController.updateNote);
router.delete('/:id', auth, noteController.deleteNote);
router.post('/:id/archive', auth, noteController.archiveNote);
router.get('/search', auth, noteController.searchNotes);

module.exports = router;