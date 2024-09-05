
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        default:null,
        ref:"Users"

    },
    phone: {
        type: String
    },
    DOJ: {
        type: Date
    },
    DOB: {
        type: String
    },
    department: {
        type: String
    },
    designation: {
        type: String
    },
    salary: {
        type: String
    },
    address: {
        type: String
    }
}, {timestamps: true});

const profileModel = mongoose.model('Profile', profileSchema);

module.exports = profileModel;
