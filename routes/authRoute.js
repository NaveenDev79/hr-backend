const express = require('express');
const {
    signUp,
    signIn,
    ForgetPassword,
    ResetPassword,
    OTPVerification
} = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forget-password', ForgetPassword);
router.post('/otp-validate/:id', OTPVerification);
router.post('/reset-password/:id', ResetPassword);
module.exports = router;