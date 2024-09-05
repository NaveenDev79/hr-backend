const express = require('express');
const {
    signUp,
    signIn,
    ForgetPassword,
    ResetPassword,
    OTPVerification,
    getProfile,
    updateProfile,
    getAdmin,
    blockAdmin,
    AdminVerify
} = require('../controllers/authController');
const { verifyToken, verifyAdmin } = require('../middlewares/Token');
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forget-password', ForgetPassword);
router.post('/otp-validate',verifyToken, OTPVerification);
router.post('/reset-password',verifyToken, ResetPassword);

// 
router.get('/profile/:id',verifyToken,getProfile );
router.put('/profile/:id',verifyToken,updateProfile );

// Verify
router.get('/all-admin',verifyAdmin,getAdmin)
router.post('/admin/verify',verifyAdmin,AdminVerify)
router.post('/admin/block',verifyAdmin,blockAdmin)

module.exports = router;