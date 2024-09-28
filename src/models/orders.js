const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  totalAmount: {
    type: Number,
    required: true,
    min: 0 
  },
  amountReceived: {
    type: Number,
    required: true,
    min: 0
  },
  balanceAmount: {
    type: Number,
    required: true,
    min: 0  
  },
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',  
    required: true
  },
  cart: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1  
    }
  }],
  date: {
    type: Date,  
    default: Date.now,
    required: true
  },
  time: {
    type: String, 
    required: true
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
