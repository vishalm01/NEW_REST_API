const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,  
  },
  MRP: {
    type: Number,
    required: true,  
    min: 0
  },
  Rate: {
    type: Number,
    required: true,  
    min: 0
  },
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
