const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const nodemailer = require("nodemailer");

const generateToken = ({id, role}) => {
    const token = jwt.sign({
        id: id,
        role: role
    }, process.env.JWT_SECRET, {expiresIn: '7d'});

    return token;
};

const HashPassword = (password) => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}
const ComparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};

const generateOTP = () => {
    return otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false
    });
}

const sendEmail = async(otp, email) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'berta.macgyver5@ethereal.email',
            pass: 'gVZ2tbgR6edQxdmn1H'
        }
    });
    const info = await transporter.sendMail({
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', 
        to: email, 
        subject: "OTP for password verification.", html: `
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    }
                    h2 {
                        color: #333;
                    }
                    p {
                        line-height: 1.6;
                    }
                    .otp-code {
                        font-size: 24px;
                        font-weight: bold;
                        background-color: #f0f0f0;
                        padding: 10px;
                        border-radius: 5px;
                        margin-bottom: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>OTP for Password Verification</h2>
                    <p>Hello,</p>
                    <p>Your OTP for password verification is:</p>
                    <div class="otp-code">${otp}</div>
                    <p>Please use this OTP to verify your password change request.</p>
                    <p>If you did not request this change, please ignore this email.</p>
                </div>
            </body>
            </html>
        `});
 
        
        
 

}
module.exports = {
    generateToken,
    HashPassword,
    ComparePassword,
    generateOTP,
    sendEmail
};
