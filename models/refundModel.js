const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        default:null,
        ref: "User"
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default:null,
    },
    amount: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    AppliedOn: {
        type: Date, 
    },
    ApprovedOn: {
        type: Date, 
    },
    ApprovedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default:null,
    },
    status: {
        default: "Pending",
        type: String,
        enum: ["Pending", "Approved", "Rejected"]
    },
    remark: {
        type: String
    }
}, {timestamps: true});

const refundModel = mongoose.model("Refund", refundSchema);

module.exports = refundModel;
