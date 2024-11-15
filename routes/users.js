// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { check } = require('express-validator');

router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    userController.registerUser
);

router.post('/login', userController.loginUser);
router.post('/reset-password', userController.resetPassword);
router.put('/reset/:token', userController.updatePassword);

module.exports = router;