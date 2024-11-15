const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Ensure the name field is required
    },
    email: {
        type: String,
        required: true, // Ensure the email field is required
        unique: true, // Ensure the email is unique
    },
    password: {
        type: String,
        required: true, // Ensure the password field is required
    },
    resetToken: {
        type: String, // Optional field for password reset token
    },
    resetTokenExp: {
        type: Date, // Optional field for the expiration of the reset token
    },
});

module.exports = mongoose.model('User', UserSchema);