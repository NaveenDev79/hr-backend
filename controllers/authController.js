const {generateToken, HashPassword, ComparePassword, generateOTP, sendEmail} = require("../helpers/utils");
const userModel = require("../models/userModel");

const signUp = async(req, res, next) => {
    try {
        const {name, email, password} = req.body;
        const Role = req.body.role
            ? req.body.role
            : "Employee"

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({message: 'Name, email, and password are required.', success: false});
        }

        const userExist = await userModel.findOne({email: email});
        if (userExist) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            return next(error);
        }
        const hashedPassword = HashPassword(password);

        const newUser = new userModel({name, email, password: hashedPassword, role: Role});

        await newUser.save();
        res
            .status(201)
            .json({message: 'User signed up successfully', success: true});
    } catch (error) {
        next(error);
    }
};

const signIn = async(req, res,next) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            const error = new Error('Email and password are required.');
            error.statusCode = 400;
            next(error);
        }

        const userExist = await userModel.findOne({email: email});
        if (!userExist) {
            const error = new Error('User not found');
            error.statusCode = 404;
            next(error);
        }

        const isPasswordMatched = ComparePassword(password, userExist.password);
        if (!isPasswordMatched) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            next(error);
        }

        const token = generateToken({id: userExist._id, email: userExist.email});
        res
            .status(200)
            .json({
                message: 'User signed in successfully',
                token,
                user: {
                    name: userExist.name,
                    email: userExist.email,
                    role: userExist.role
                },
                success: true
            });
    } catch (error) {
        next(error);
    }
};

const ForgetPassword = async(req, res) => {
    try {
        const {email} = req.body;
        if (!email) {
            return res
                .status(400)
                .json({message: 'Email is required.', success: false});
        }
        const userExist = await userModel.findOne({email: email});
        if (!userExist) {
            return res
                .status(404)
                .json({message: 'User not found.', success: false});
        }
        const OTP = generateOTP();

        userExist.VerificationCode = OTP;
        await userExist.save();
        await sendEmail(userExist.VerificationCode, userExist.email);

        res
            .status(200)
            .json({message: 'OTP sent successfully to email.', success: true});
    } catch (error) {
        console.error('Error during forget password:', error.message);
        res
            .status(500)
            .json({message: 'Internal server error', success: false});
    }
};

const OTPVerification = async(req, res) => {
    try {
        const {id} = req.params;
        const {otp} = req.body;

        if (!otp) {
            return res
                .status(400)
                .json({message: 'OTP is required.', success: false});
        }

        const userExist = await userModel.findById(id);
        if (!userExist) {
            return res
                .status(404)
                .json({message: 'User not found.', success: false});
        }

        if (Number(otp) !== userExist.VerificationCode) {
            return res
                .status(401)
                .json({message: 'Invalid OTP.', success: false});
        }
        // userExist.VerificationCode = null; await userExist.save();

        res
            .status(200)
            .json({message: 'OTP matched successfully.', success: true});
    } catch (error) {
        console.error('Error during OTP verification:', error.message);
        res
            .status(500)
            .json({message: 'Internal server error', success: false});
    }
};
const ResetPassword = async(req, res) => {
    try {
        const {id} = req.params;
        const {password, confirmPassword} = req.body;

        if (!password || !confirmPassword) {
            return res
                .status(400)
                .json({message: 'Password and confirmPassword are required.', success: false});
        }

        if (password !== confirmPassword) {
            return res
                .status(400)
                .json({message: 'Password and confirmPassword are not same.', success: false});
        }

        const userExist = await userModel.findById(id);
        if (!userExist) {
            return res
                .status(404)
                .json({message: 'User not found.', success: false});
        }

        userExist.password = HashPassword(password);
        userExist.VerificationCode = null;
        await userExist.save();

        res
            .status(200)
            .json({message: 'Password reset successfully.', success: true});
    } catch (error) {
        console.error('Error during password reset:', error.message);
        res
            .status(500)
            .json({message: 'Internal server error', success: false});
    }
};
module.exports = {
    signUp,
    signIn,
    ForgetPassword,
    ResetPassword,
    OTPVerification
};
