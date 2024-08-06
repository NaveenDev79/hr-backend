const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Users", 
        required: true  
    },
    checkinTime: {
        type: Date,   
    },
    checkoutTime: {
        type: Date,   
    },
    date: {
        type: Date, 
        required: true
    },
    isChecked:{
        default:false,
        type:Boolean
    }
}, ); 

const attendanceModel = mongoose.model("Attendance", attendanceSchema);

module.exports = attendanceModel;
