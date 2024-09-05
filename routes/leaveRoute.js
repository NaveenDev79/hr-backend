const { AddLeave, getLeaveDetails, GetAllLeave, GetAllLeavesOfUser, DeleteLeave, updateLeave, StatsLeave, getUserWithLeave } = require('../controllers/leaveController');
const { verifyToken, verifyAdmin } = require('../middlewares/Token');

const router = require('express').Router();

router.post('/',verifyToken,AddLeave );
router.get('/:id',verifyToken,getLeaveDetails );
router.put('/:id',verifyAdmin,updateLeave );
router.get('/get/all',verifyToken,GetAllLeave );
router.get('/get/user/:id',verifyToken,GetAllLeavesOfUser );
router.delete('/:id',verifyToken,DeleteLeave );

// stats
router.get('/get/stats',StatsLeave )

// admin - user with Pending Leave

router.get('/admin/leave',getUserWithLeave );





module.exports = router;
