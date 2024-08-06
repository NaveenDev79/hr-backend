const {generateToken, HashPassword, ComparePassword, generateOTP, sendEmail} = require("../helpers/utils");
const attendanceModel = require("../models/attendenceModel");
const userModel = require("../models/userModel");

const checkIn = async (req, res, next) => {
    try {
        const { userId,  } = req.body;
 
        if (!userId) {
            return res.status(400).json({ message: 'Both userId are required.', success: false });
        }
 
        const user = await userModel.findById(userId);
        if (!user) {
            const error = new Error('User does not exist');
            error.statusCode = 404;  
            return next(error);
        }

        // Check if the user has already checked in today
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of today

        const existingCheckIn = await attendanceModel.findOne({
            userId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        if (existingCheckIn) {
            return res.status(409).json({ message: 'User has already checked in today.', success: false });
        }
        const checkInTime = new Date();

        // Create new check-in record
        const newCheckIn = new attendanceModel({
            userId,
            checkinTime:checkInTime,
            date: new Date(),
            isChecked: true
        });

        await newCheckIn.save();

        return res.status(201).json({ message: 'Check-in successful.', success: true });

    } catch (error) {
        next(error);
    }
};


const checkOut = async (req, res, next) => {
    try {
        const { userId, attendanceId } = req.body;
 
        if (!userId || !attendanceId) {
            return res.status(400).json({ message: 'User ID and attendance ID are required.', success: false });
        } 
        const user = await userModel.findById(userId);
        if (!user) {
            const error = new Error('User does not exist');
            error.statusCode = 404;  
            return next(error);
        } 
        const checkoutTime = new Date();
        const updatedAttendance = await attendanceModel.findByIdAndUpdate(
            attendanceId,
            { checkoutTime },
            { new: true }  
        );

        if (!updatedAttendance) {
            const error = new Error('Check-in record not found or already checked out');
            error.statusCode = 404;  
            return next(error);
        } 
        res.status(200).json({ message: 'Checkout successful.', success: true });

    } catch (error) {
        next(error);
    }
};
  
const getTodaysAttendenceDetail = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.', success: false });
        }

        // Check if the user exists
        const user = await userModel.findById(userId);
        if (!user) {
            const error = new Error('User does not exist');
            error.statusCode = 404;
            return next(error);
        }

        // Get today's date range
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of the day
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of the day

        // Find the attendance record for the current day
        const todaysAttendance = await attendanceModel.findOne({
            userId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        if (!todaysAttendance) {
            const error = new Error('No check-in record found for today.');
            error.statusCode = 404;
            return next(error);
        }

        // Send the attendance record
        res.status(200).json({ message: 'Attendance details for today.', todaysAttendance, success: true });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    checkIn,checkOut ,getTodaysAttendenceDetail
};
