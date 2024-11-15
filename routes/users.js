const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');

// Register a new user
router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    userController.registerUser
);

// Login a user
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    userController.loginUser
);

// Request password reset
router.post('/reset-password', userController.resetPassword);

// Update password using reset token
router.post('/update-password', userController.updatePassword);

module.exports = router;