// controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail'); // Placeholder function for sending emails

// Register a new user
exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Login a user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Request password reset
exports.resetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Set reset token and expiry time on user model
        user.resetToken = resetToken;
        user.resetTokenExp = Date.now() + 3600000; // 1 hour from now

        await user.save();

        const resetUrl = `${req.protocol}://${req.get('host')}/api/users/reset/${resetToken}`;

        await sendEmail(email, 'Password Reset Request', `Please reset your password using the following link: ${resetUrl}`);

        res.json({ msg: 'Password reset link sent' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Update password
exports.updatePassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        // Find user by reset token and check if token is valid
        let user = await User.findOne({
            resetToken: token,
            resetTokenExp: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired token' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear reset token and expiry time
        user.resetToken = undefined;
        user.resetTokenExp = undefined;

        await user.save();

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};