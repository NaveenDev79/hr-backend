const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Users",  
    },
    employeeName: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
});

const attendanceModel = mongoose.model("Attendance", attendanceSchema);

module.exports = attendanceModel;
