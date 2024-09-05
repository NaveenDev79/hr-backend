const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "User",
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "User",
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    cause: {
        type: String
    },
    ApprovedOn: {
        type: Date
    },
    status: {
        default: "Pending",
        type: String,
        enum: ["Pending", "Approved", "Rejected"]
    },
    remark: {
        type: String
    },
    days: {
        type: String
    }
}, {timestamps: true});

const leaveModel = mongoose.model("Leave", leaveSchema);

module.exports = leaveModel;
