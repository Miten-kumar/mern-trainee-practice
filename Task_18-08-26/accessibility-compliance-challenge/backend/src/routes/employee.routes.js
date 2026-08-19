const express = require('express');
const controller = require('../controllers/employee.controller');
const { validateEmployeeBody } = require('../middleware/validateRequest');

const router = express.Router();

router.get('/departments', controller.listDepartments);
router.get('/', controller.listEmployees);
router.get('/:id', controller.getEmployee);
router.post('/', validateEmployeeBody, controller.createEmployee);
router.put('/:id', validateEmployeeBody, controller.updateEmployee);
router.delete('/:id', controller.deleteEmployee);

module.exports = router;
