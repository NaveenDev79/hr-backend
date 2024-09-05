const profileModel = require("../models/profileModel");
const userModel = require("../models/userModel");

const GetAllEmployees = async (req, res, next) => {
    try {
        const users = await userModel.find({ role: 'Employee' });
        
        if (!users || users.length === 0) {
            const error = new Error('No employees found.');
            error.statusCode = 404;
            return next(error);
        }

        return res.status(200).json({
            message: 'Employees retrieved successfully.',
            success: true,
            data: users
        });

    } catch (error) {
        next(error);
    }
};


const getEmployee = async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    
    try {
        const user = await userModel.findById(id);
        
        if (!user) {
            const error = new Error('No employee found with the specified ID.');
            error.statusCode = 404;
            return next(error);
        }

        const userProfile = await profileModel.findOne({ userId: id });

        const response = {
            ...user._doc,
            ...(userProfile ? userProfile._doc : {})
        };

        return res.status(200).json({
            message: 'Employee fetched successfully.',
            success: true,
            data: response
        });

    } catch (error) {
        next(error);
    }
};

const UpdateEmployee = async (req, res, next) => {
    const { id } = req.params;
    const {phone,DOB,department,designation,salary,address,name,email} = req.body;
    try {
        const user = await userModel.findById(id);
        
        if (!user) {
            const error = new Error('employee  Not found with the specified ID.');
            error.statusCode = 404;
            return next(error);
        }
        const userProfile = await profileModel.findOne({userId:id});
        
        if (!userProfile) {
            const error = new Error('employee Profile Not found with the specified ID.');
            error.statusCode = 404;
            return next(error);
        }

        if(phone !=undefined) userProfile.phone = phone;
        if(DOB !=undefined) userProfile.DOB = DOB;
        if(department !=undefined) userProfile.department = department;
        if(designation !=undefined) userProfile.designation = designation;
        if(salary !=undefined) userProfile.salary = salary;
        if(address !=undefined) userProfile.address = address;
        if(name !=undefined) user.name = name; 
        if(email !=undefined) user.email = email;  
        await userProfile.save();
        await user.save();

        return res.status(200).json({
            message: 'Employee Profile Updated.',
            success: true, 
        });

    } catch (error) {
        next(error);
    }
};

const UploadImage = async (req, res, next) => {

    console.log(req.body);
    return;
    
    try {
        const users = await userModel.find({ role: 'Employee' });
        
        if (!users || users.length === 0) {
            const error = new Error('No employees found.');
            error.statusCode = 404;
            return next(error);
        }

        return res.status(200).json({
            message: 'Employees retrieved successfully.',
            success: true,
            data: users
        });

    } catch (error) {
        next(error);
    }
};



module.exports = { GetAllEmployees,getEmployee,UpdateEmployee, UploadImage};