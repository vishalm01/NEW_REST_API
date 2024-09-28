const { createItem, getAllItems, getItemById, deleteItem, updateItem } = require('../controllers/itemController');

const router = require('express').Router();

router.post('/create', createItem);
router.get('/', getAllItems);
router.get('/:id', getItemById);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
