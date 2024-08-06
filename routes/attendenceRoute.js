const express = require('express');
const { checkIn, checkOut, getTodaysAttendenceDetail } = require('../controllers/attendenceController');
const router = express.Router();

router.post('/check-in', checkIn); 
router.put('/check-out', checkOut);
router.get('/:userId', getTodaysAttendenceDetail);  
module.exports = router;