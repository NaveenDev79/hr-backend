const mongoose = require("mongoose"); 

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
            "Admin", "HR", "Employee"
        ],
        default: "Employee"
    },
    VerificationCode: {
        type: Number
    },
    image:{
        type:String,
        default:"https://res.cloudinary.com/muhamad-ali/image/upload/v1722761326/upload_7a64366f1f83f1aab1341f8e68482d72_fwpqic.jpg"
    },
    isVerified:{
        type:Boolean,
        default:false
    }
}, {timestamps: true});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
