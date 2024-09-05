const express = require('express');
const { checkIn, checkOut, getTodaysAttendenceDetail, getTodaysAttendence, getCurrentMonthAttendence, getAllAttendence } = require('../controllers/attendenceController');
const { verifyToken } = require('../middlewares/Token');
const router = express.Router();

router.post('/check-in', checkIn); 
router.put('/check-out', checkOut);
router.get('/today',verifyToken, getTodaysAttendence);
router.get('/month/:id', verifyToken, getCurrentMonthAttendence);  
router.get('/all/:id', verifyToken, getAllAttendence);  
module.exports = router;