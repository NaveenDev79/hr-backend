const router = require('express').Router();


const base = '/api/v1';


router.use(`${base}/auth`, require('./authRoute'));
router.use(`${base}/attendence`, require('./attendenceRoute'));
router.use(`${base}/refund`, require('./refundRoute'));
router.use(`${base}/leave`, require('./leaveRoute'));
router.use(`${base}/employee`, require('./employeeRoute'));

module.exports = router;