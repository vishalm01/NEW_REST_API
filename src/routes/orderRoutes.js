const { createOrder } = require('../controllers/orderController');
const router = require('express').Router();

router.post('/create', createOrder); 

module.exports = router;
