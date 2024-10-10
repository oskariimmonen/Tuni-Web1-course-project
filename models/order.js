const mongoose = require('mongoose');
const OrderedItem = require('./orderedItem');

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.ObjectId,
    required: true,
  },
  items: {
    type: [OrderedItem.schema],
    required: true,
    minLength: 1
  }
});

// Omit the version key when serialized to JSON
orderSchema.set('toJSON', { virtuals: false, versionKey: false });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;