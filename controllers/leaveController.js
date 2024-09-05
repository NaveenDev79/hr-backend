const { trusted } = require("mongoose");
const leaveModel = require("../models/leaveModel"); 

const AddLeave = async(req, res, next) => {
    const {from,type,cause, to,days,} = req.body;
    const userId = req.user.id;
    
    try {
        const leaveData={userId,from,to,type,cause,days};
        const newLeave = new leaveModel(leaveData);
        await newLeave.save();
        return res
            .status(201)
            .json({message: 'leave req. added successfully',data:newLeave,success:true});
    } catch (error) {
        next(error);
    }
}

const getLeaveDetails = async(req, res, next) => {
    const {id} = req.params;
    try {
        const leave = await leaveModel.findById(id).populate('approvedBy').populate('userId');

        if (!leave) {
            return res
                .status(404)
                .json({message: 'leave with id not found'});
        }
        return res
            .status(200)
            .json({message: 'leave data', data: leave,success:true});
    } catch (error) {
        next(error);
    }
}
const getUserWithLeave = async (req, res, next) => { 
    try { 
        const leaves = await leaveModel.find({ status: 'Pending' }).populate('userId');
 
        if (leaves.length === 0) {
            return res
                .status(404)
                .json({ message: 'No pending leave requests found', success: false });
        }
 

        return res
            .status(200)
            .json({ message: 'User IDs with pending leaves retrieved successfully', data: leaves, success: true });
    } catch (error) {
        next(error);
    }
};


const updateLeave = async(req, res, next) => {
    const {approvedBy,ApprovedOn,status,remark} = req.body;
    try {
        const {id} = req.params;
        const leave = await leaveModel.findById(id);
        if (!leave) {
            const error = new Error("leave not found.");
            error.statusCode = 404;
            return next(error);
        }  
        if (status !== undefined) leave.status = status; 
        if (remark !== undefined) leave.remark = remark;
        if (approvedBy !== undefined) leave.approvedBy = approvedBy;
        if (ApprovedOn !== undefined) leave.ApprovedOn = ApprovedOn;
 
        const updatedItem = await leave.save();

        return res
            .status(200)
            .json({message: 'leave updated Sucesfully',success:true, data: updatedItem});
    } catch (error) {
        next(error);
    }
}

const GetAllLeave = async(req, res, next) => {
    try { 
        const allLeaves = await leaveModel.find().populate('userId').populate('approvedBy');
        
        
        if(allLeaves.length==0){
            return res
            .status(200)
            .json({message: 'No leaves data in DB', data: allLeaves, success:true});
        }
        return res
            .status(200)
            .json({message: 'All leaves data', data: allLeaves, success:true});
    } catch (error) {
        next(error);
    }
}

const GetAllLeavesOfUser = async(req, res, next) => {
    try {
        const {id} = req.params;
        const LeaveData = await leaveModel.find({userId:id}) || [];

        return res
            .status(200)
            .json({message: 'Leave data of user', data: LeaveData,success:true});
    } catch (error) {
        next(error);
    }
}

const DeleteLeave = async(req, res, next) => {
    try {
        const {id} = req.params;
        const deletedItem = await leaveModel.findByIdAndDelete(id);

        if (!deletedItem) {
            const error = new Error("Leave not found or already deleted.");
            error.statusCode = 404;
            return next(error);
        }

        return res
            .status(200)
            .json({message: 'Leave successfully deleted'});
    } catch (error) {
        next(error);
    }
}
const StatsLeave = async (req, res, next) => {
    try {
        const today = new Date();
 
        const Pending = await leaveModel.countDocuments({
            status: "Pending"
        });
 
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
 
        const Approved = await leaveModel.find({
            createdAt: { $gte: startOfMonth, $lt: endOfMonth },
            status: "Approved"
        });

       

        res.status(200).json({
            success: true,
            data: {
                Pending,
                Approved:Approved.length, 
            }
        });
    } catch (error) {
        console.error('Error in /get/leave-stats route:', error);
        next(error);
    }
};


module.exports = {
    AddLeave,
    getLeaveDetails,
    GetAllLeave,
    DeleteLeave,
    GetAllLeavesOfUser,
    updateLeave,
    StatsLeave,
    getUserWithLeave
}