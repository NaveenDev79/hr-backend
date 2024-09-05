const refundModel = require("../models/refundModel");

const AddRefund = async(req, res, next) => {
    try {
        const newRefund = new refundModel(req.body);
        await newRefund.save();
        return res
            .status(201)
            .json({message: 'Refund added successfully', success:true});
    } catch (error) {
        next(error);
    }
}

const GetRefund = async(req, res, next) => {
    const {id} = req.params;
    try {
        const refund = await refundModel.findById(id).populate('userId').populate('addedBy').populate('ApprovedBy');
       
        

        if (!refund) {
            return res
                .status(404)
                .json({message: 'Refund not found'});
        }
        return res
            .status(200)
            .json({message: 'Refund data', data: refund, success:true});
    } catch (error) {
        next(error);
    }
}

const updateRefund = async(req, res, next) => {
    console.log(req.body);
    
    const {userId,addedBy,status,ApprovedBy,AppliedOn,ApprovedOn,remark} = req.body;
    try {
        const {id} = req.params;
        const refund = await refundModel.findById(id);
        if (!refund) {
            const error = new Error("Refund not found.");
            error.statusCode = 404;
            return next(error);
        } 
        if (userId !== undefined) refund.userId = userId;
        if (addedBy !== undefined) refund.addedBy = addedBy;
        if (status !== undefined) refund.status = status;
        if (AppliedOn !== undefined) refund.AppliedOn = AppliedOn;
        if (ApprovedBy !== undefined) refund.ApprovedBy = ApprovedBy;
        if (ApprovedOn !== undefined) refund.ApprovedOn = ApprovedOn;
        if (remark !== undefined) refund.remark = remark;
 
        const updatedItem = await refund.save();

        return res
            .status(200)
            .json({message: 'refund updated Sucesfully', data: updatedItem, success:true});
    } catch (error) {
        next(error);
    }
}

const GetAllRefunds = async(req, res, next) => {
    try {
        const userId = req.user.id;
        const allUnApllied = await refundModel.find({
            userId: { $ne: userId }
          }).populate('userId').populate('addedBy')

        return res
            .status(200)
            .json({message: 'Refund data', data: allUnApllied, success:true});
    } catch (error) {
        next(error);
    }
}

const GetAllUserRefunds = async(req, res, next) => {
    try {
        const {id} = req.params;
        const userRefunds = await refundModel.find({userId:id}) || []

        return res
            .status(200)
            .json({message: 'Refund data of user', data: userRefunds, success:true});
    } catch (error) {
        next(error);
    }
}

const DeleteRefund = async(req, res, next) => {
    try {
        const {id} = req.params;
        const deletedItem = await refundModel.findByIdAndDelete(id);

        if (!deletedItem) {
            const error = new Error("Refund not found or already deleted.");
            error.statusCode = 404;
            return next(error);
        }

        return res
            .status(200)
            .json({message: 'Refund successfully deleted', success:true});
    } catch (error) {
        next(error);
    }
}

const StatsRefund=async (req, res, next) => {
    try {
        const today = new Date(); 
 
        const Pending = await refundModel.countDocuments({  
            status: "Pending"
        }); 
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const approvedRefundsThisMonth = await refundModel.find({
            AppliedOn: { $gte: startOfMonth, $lt: endOfMonth },
            status: "Approved"
        });

        const Approved = approvedRefundsThisMonth.length; 

        const Total = approvedRefundsThisMonth.reduce((sum, refund) => {
            return sum + parseFloat(refund.amount);
        }, 0);
        res.status(200).json({
            success: true,
            data: {
                Pending,
                Approved,
                Total
            }
        });
    } catch (error) {
        console.error('Error in /get/stats route:', error);
        next(error);
    }
};

const getUserWithRefund = async (req, res, next) => { 
    try { 
        const refund = await refundModel.find({ status: 'Pending' }).populate('userId');
 
        if (refund.length === 0) {
            return res
                .status(404)
                .json({ message: 'No pending leave requests found', success: false });
        }
 

        return res
            .status(200)
            .json({ message: 'User IDs with pending refund retrieved successfully', data: refund, success: true });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    AddRefund,
    GetRefund,
    GetAllRefunds,
    DeleteRefund,
    GetAllUserRefunds,
    updateRefund,
    StatsRefund,getUserWithRefund
}