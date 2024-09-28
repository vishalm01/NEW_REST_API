const { getCustomers, getCustomerById } = require('../controllers/customerController');
const router = require('express').Router();

router.get('/', getCustomers); 
router.get('/:id', getCustomerById);

module.exports = router;
