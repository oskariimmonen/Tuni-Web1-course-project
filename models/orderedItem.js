const mongoose = require('mongoose');
const Product = require('./product');


const orderedItemSchema = new mongoose.Schema({
  product: {
    type: Product.schema,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

// Omit the version key when serialized to JSON
orderedItemSchema.set('toJSON', { virtuals: false, versionKey: false });

const OrderedItem = mongoose.model('OrderedItem', orderedItemSchema);
module.exports = OrderedItem;