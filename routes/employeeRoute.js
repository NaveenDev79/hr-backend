const {GetAllEmployees, getEmployee, UpdateEmployee} = require('../controllers/employeeController');
const {verifyToken, verifyAdmin} = require('../middlewares/Token');

const router = require('express').Router();

router.get('/get/all', verifyAdmin, GetAllEmployees);
router.post('/upload-image', verifyToken, GetAllEmployees);
router.get('/:id', verifyToken, getEmployee);
router.put('/:id', verifyToken, UpdateEmployee);
router.delete('/:id', verifyAdmin, GetAllEmployees);

module.exports = router;
