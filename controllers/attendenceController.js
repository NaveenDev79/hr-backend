const {generateToken, HashPassword, ComparePassword, generateOTP, sendEmail} = require("../helpers/utils");
const attendanceModel = require("../models/attendenceModel");
const userModel = require("../models/userModel");

const checkIn = async(req, res, next) => {
    try {
        const {userId} = req.body;

        if (!userId) {
            return res
                .status(400)
                .json({message: 'UserId is required.', success: false});
        }

        const user = await userModel.findById(userId);
        if (!user) {
            const error = new Error('User does not exist');
            error.statusCode = 404;
            return next(error);
        }

        // Check if the user has already checked in today
        const todayDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        const currentTime = new Date().toLocaleTimeString('en-US', {hour12: false});

        const existingCheckIn = await attendanceModel.findOne({userId, date: todayDate});

        if (existingCheckIn) {
            return res
                .status(409)
                .json({message: 'User has already checked in today.', success: false});
        }

        // Create new check-in record
        const newCheckIn = new attendanceModel({userId, checkinTime: currentTime, date: todayDate, isChecked: true});

        await newCheckIn.save();

        return res
            .status(201)
            .json({message: 'Check-in successful.', success: true});

    } catch (error) {
        next(error);
    }
};

const checkOut = async(req, res, next) => {
    try {
        const {userId} = req.body;

        if (!userId) {
            return res
                .status(400)
                .json({message: 'User ID is required.', success: false});
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({message: 'User does not exist', success: false});
        }

        const todayDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        const checkoutTime = new Date().toLocaleTimeString('en-US', {hour12: false});

        const existingAttendance = await attendanceModel.findOne({userId, date: todayDate});

        if (!existingAttendance) {
            return res
                .status(404)
                .json({message: 'Check-in record not found or already checked out', success: false});
        }

        // Update checkout time
        existingAttendance.checkoutTime = checkoutTime;
        existingAttendance.isChecked = false;
        await existingAttendance.save();

        res
            .status(200)
            .json({message: 'Checkout successful.', success: true});

    } catch (error) {
        next(error);
    }
};

const getTodaysAttendenceDetail = async(req, res, next) => {
    try {
        const {userId} = req.params;

        if (!userId) {
            return res
                .status(400)
                .json({message: 'User ID is required.', success: false});
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
        res
            .status(200)
            .json({message: 'Attendance details for today.', todaysAttendance, success: true});

    } catch (error) {
        next(error);
    }
};

const getTodaysAttendence = async(req, res, next) => {

    try {
        const userId = req.user.id;

        if (!userId) {
            return res
                .status(400)
                .json({message: 'User ID is required.', success: false});
        }
        const user = await userModel.findById(userId);
        if (!user) {
            const error = new Error('User does not exist');
            error.statusCode = 404;
            return next(error);
        }

        const todayDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        // Find the attendance record for the current day
        const todaysAttendance = await attendanceModel.findOne({userId, date: todayDate});

        if (!todaysAttendance) {
            const error = new Error('No check-in record found for today.');
            error.statusCode = 404;
            return next(error);
        }

        // Send the attendance record
        res
            .status(200)
            .json({message: 'Attendance details for today.', data: todaysAttendance, success: true});

    } catch (error) {
        next(error);
    }
};

const getCurrentMonthAttendence = async(req, res, next) => {
    const {id} = req.params;

    try {
        const userId = id

        if (!userId) {
            return res
                .status(400)
                .json({message: 'User ID is required.', success: false});
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({message: 'User does not exist.', success: false});
        }

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Format the dates to match the 'MM/DD/YYYY' format
        const firstDayFormatted = firstDayOfMonth.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        const lastDayFormatted = lastDayOfMonth.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        // Find the attendance records for the current month
        const monthlyAttendance = await attendanceModel.find({
            userId,
            date: {
                $gte: firstDayFormatted,
                $lte: lastDayFormatted
            }
        });

        if (!monthlyAttendance || monthlyAttendance.length === 0) {
            return res
                .status(404)
                .json({message: 'No attendance records found for the current month.', success: false});
        }

        // Send the attendance records
        res
            .status(200)
            .json({message: 'Attendance details for the current month.', data: monthlyAttendance, success: true});

    } catch (error) {
        next(error);
    }
};

const getAllAttendence = async(req, res, next) => {

    const {id} = req.params;

    try {

        const userId = id

        if (!userId) {
            return res
                .status(400)
                .json({message: 'User ID is required.', success: false});
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({message: 'User does not exist.', success: false});
        }

        const monthlyAttendance = await attendanceModel.find({userId});

        if (!monthlyAttendance || monthlyAttendance.length === 0) {
            return res
                .status(404)
                .json({message: 'No attendance records found for the current user.', success: false});
        }

        // Send the attendance records
        res
            .status(200)
            .json({message: 'Attendance details for the current user.', data: monthlyAttendance, success: true});

    } catch (error) {
        next(error);
    }
};

module.exports = {
    checkIn,
    checkOut,
    getTodaysAttendenceDetail,
    getTodaysAttendence,
    getCurrentMonthAttendence,
    getAllAttendence
};
