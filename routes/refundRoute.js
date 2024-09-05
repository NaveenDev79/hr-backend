const {AddRefund, GetRefund, GetAllRefunds, DeleteRefund, GetAllUserRefunds, updateRefund, StatsRefund, getUserWithRefund} = require('../controllers/refundController');
const { verifyToken, verifyAdmin } = require('../middlewares/Token'); 


const router = require('express').Router();

router.post('/',verifyToken, AddRefund);
router.get('/:id',verifyToken, GetRefund);
router.put('/:id',verifyToken, updateRefund);
router.get('/get/all',verifyToken, GetAllRefunds);
router.get('/get/user/:id',verifyToken, GetAllUserRefunds);
router.delete('/:id',verifyAdmin, DeleteRefund);

// stats
router.get('/get/stats', StatsRefund)
// admin
router.get('/admin/refund',getUserWithRefund );





module.exports = router;
