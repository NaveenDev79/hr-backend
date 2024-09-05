const {generateToken, HashPassword, ComparePassword, generateOTP, sendEmail} = require("../helpers/utils");
const profileModel = require("../models/profileModel");
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

        const newProfile = new profileModel({userId:newUser._id, DOJ:new Date()});
        await newProfile.save();
        res
            .status(201)
            .json({message: 'User signed up successfully', success: true});
    } catch (error) {
        next(error);
    }
};

const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Email and password are required.');
            error.statusCode = 400;
            return next(error);  
        }

        const userExist = await userModel.findOne({ email: email });
        if (!userExist) {
            const error = new Error('User not found');
            error.statusCode = 404;
            return next(error);  
        }

        const isPasswordMatched = ComparePassword(password, userExist.password);
         
        
        if (!isPasswordMatched) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            return next(error);  
        }

        const token = generateToken({ id: userExist._id,role:userExist?.role});
      
        const newProfile = await profileModel.findOne({userId:userExist._id}); 
        return res.status(200).json({
            message: 'User signed in successfully',
            token,
            user: {
                _id: userExist._id,
                name: userExist.name,
                image: userExist.image,
                email: userExist.email,
                role: userExist.role,
                DOJ:newProfile.DOJ,
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
        const token = generateToken({id:userExist._id,role:userExist.role});

        res
            .status(200)
            .json({message: 'OTP sent successfully to email.', data:token,success: true});
    } catch (error) {
        console.error('Error during forget password:', error.message);
        res
            .status(500)
            .json({message: 'Internal server error', success: false});
    }
};

const OTPVerification = async(req, res) => {
    try { 
        
        const id = req.user.id;
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
            .json({message: 'OTP matched successfully.', success: true, data:{id: userExist._id}});
    } catch (error) {
        console.error('Error during OTP verification:', error.message);
        res
            .status(500)
            .json({message: 'Internal server error', success: false});
    }
};
const ResetPassword = async(req, res) => {
    try {
        const id = req.user.id;
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

const getProfile = async(req, res, next) => {
    try {
        const id = req.user.id;
         

        if (!id) {
            return res
                .status(400)
                .json({message: 'id not found..', success: false});
        }

        const userExist = await userModel.findOne({userId:id}).populate("userId");
        if (!userExist) {
            const error = new Error('User doesnot exists');
            error.statusCode = 404;
            return next(error);
        }
 
        res
            .status(201)
            .json({message: 'User Data', success: true, data:userExist});
    } catch (error) {
        next(error);
    }
};

// 

const updateProfile = async(req, res, next) => {
    try {
        const id = req.user.id;
        const {DOB,address,phone,designation,department} = req.body;
         

        if (!id) {
            return res
                .status(400)
                .json({message: 'id not found..', success: false});
        }

        const userExist = await userModel.findOne({userId:id});
        if (!userExist) {
            const error = new Error('User doesnot exists');
            error.statusCode = 404;
            return next(error);
        }
        // update

        if (DOB !== undefined) userExist.DOB = DOB; 
        if (address !== undefined) userExist.address = address;
        if (phone !== undefined) userExist.phone = phone;
        if (designation !== undefined) userExist.designation = designation;
        if (department !== undefined) userExist.department = department; 
 
        const updatedItem = await userExist.save();
 
        res
            .status(201)
            .json({message: 'User Data  updated', success: true, data:updatedItem});
    } catch (error) {
        next(error);
    }
};

const getAdmin = async(req, res, next) => {
    try {
         

        const admins = await userModel.find({role:"HR"});
        if (!admins) {
            const error = new Error('NO HR admin exists');
            error.statusCode = 409;
            return next(error);
        } 
        res
            .status(201)
            .json({message: 'All admins successfully', data :admins , success : true});
    } catch (error) {
        next(error);
    }
};
const updateAdminStatus = async (id, status, res, next) => {
    try {
        const admin = await userModel.findById(id);
        if (!admin) {
            const error = new Error('No admin exists');
            error.statusCode = 409;
            return next(error);
        }

        admin.isVerified = status;
        await admin.save();

        const message = status ? 'Admin verified' : 'Admin blocked';
        res.status(200).json({ message, success: true });
    } catch (error) {
        next(error);
    }
};
 
const AdminVerify = (req, res, next) => {
    const { id } = req.body; 
    
    updateAdminStatus(id, true, res, next);
};
 
const blockAdmin = (req, res, next) => {
    const { id } = req.body;
    updateAdminStatus(id, false, res, next);
};
module.exports = {
    signUp,
    signIn,
    ForgetPassword,
    ResetPassword,
    OTPVerification,
    getProfile,
    updateProfile,
    getAdmin,
    AdminVerify,
    blockAdmin
};
