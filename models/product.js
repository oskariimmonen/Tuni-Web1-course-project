const mongoose = require('mongoose');

const SCHEMA_DEFAULTS = {
  name: { minLength: 1, maxLength: 50 },
  description: { minLength: 1, maxLength: 400 },
  // https://stackoverflow.com/questions/8188645/javascript-regex-to-match-a-url-in-a-field-of-text
  imageMatchExpression: /[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/
};

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: SCHEMA_DEFAULTS.name.minLength,
    maxLength: SCHEMA_DEFAULTS.name.maxLength
  },
  price: { 
    type: Number,
    required: true,
    min: 0,
    validate: [priceHasToBeGreaterThanZero, "Price must be greater than zero."]
  },
  image: {
    type: String,
    match: SCHEMA_DEFAULTS.imageMatchExpression
  },
  description: {
    type: String,
    trim: true,
    minLength: SCHEMA_DEFAULTS.description.minLength,
    maxLength: SCHEMA_DEFAULTS.description.maxLength
  },
});

/**
 * Checks pre-save that products price is greater than zero
 * 
 * @param {number} price price of the product
 * @returns {Promise} when resolved true / false
 */
function priceHasToBeGreaterThanZero(price) {
  return new Promise((resolve, reject) => {
      resolve(price > 0);
  });
}

// Omit the version key when serialized to JSON
productSchema.set('toJSON', { virtuals: false, versionKey: false });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;