const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Users", 
        required: true  
    },
    checkinTime: {
        type: String,   
    },
    checkoutTime: {
        type: String,   
    },
    date: {
        type: String, 
        required: true
    },
    isChecked:{
        default:false,
        type:Boolean
    }
}, ); 

const attendanceModel = mongoose.model("Attendance", attendanceSchema);

module.exports = attendanceModel;
