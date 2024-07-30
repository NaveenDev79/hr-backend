const mongoose = require("mongoose");
const {type} = require("os");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required."]
    },
    email: {
        type: String,
        required: [
            true, "Email is required."
        ],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Please enter a valid email address."]
    },
    password: {
        type: String,
        required: [
            true, "Password is required."
        ],
        minlength: [6, "Password must be at least 6 characters long."]
    },
    role: {
        type: String,
        enum: [
            "Admin", "HR Admin", "Employee"
        ],
        default: "Employee"
    },
    VerificationCode: {
        type: Number
    }
}, {timestamps: true});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
