const http = require('http');
const responseUtils = require('../utils/responseUtils');
const Product = require('../models/product');

/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response http response
 * @returns {http.ServerResponse} response http response
 */
exports.getAllProducts = async (response) => {
    const products = await Product.find();
    return responseUtils.sendJson(response, products);
};

/**
 * Get order by id
 * 
 * @param {http.ServerResponse} response http response
 * @param {string} productId id of product that is fetch
 * @returns {http.ServerResponse} response http response
 */
exports.viewProduct = async (response, productId) => {
  const product = await Product.findById(productId);
  if (!product) return responseUtils.notFound(response);
  return responseUtils.sendJson(response, product);
};

/**
 * Create a new product
 * 
 * @param {http.ServerResponse} response http response
 * @param {object} body of the product. Check docs/api.html
 * @returns {http.ServerResponse} response http response
 */
exports.createProduct = async (response, body) => {
  if (!body?.name || !body?.price || body?.price < 0) {
    return responseUtils.badRequest(response, '400 Bad Request');
  }
  try {
    const newProductObject = new Product(body);
    const returnedObject = await newProductObject.save();
    return responseUtils.createdResource(response, returnedObject);
  } catch (err) {
    return responseUtils.badRequest(response, "400 Bad Request");
  }
};

/**
 * Updated product
 * 
 * @param {http.ServerResponse} response http response
 * @param {string} productId id of product that is updated
 * @param {object} body of the product. Check docs/api.html
 * @returns {http.ServerResponse} response http response
 */
exports.updateProduct = async (response, productId, body) => {
  const product = await Product.findById(productId);
  if (!product) return responseUtils.notFound(response);

  try {
    product.name = (body.name) ? body.name : product.name;
    product.price = body.price ? body.price : product.price;
    product.description = body.description ? body.description : product.description;
    product.image = body.image ? body.image : product.image;
    await product.save();
    return responseUtils.sendJson(response, product);

  } catch (err) {
    return responseUtils.badRequest(response, "400 Bad Request");
  }
};

/**
 * Delete product by id
 * 
 * @param {http.ServerResponse} response http response
 * @param {string} productId id of product that is deleted
 * @returns {http.ServerResponse} response http response
 */
exports.deleteProduct = async (response, productId) => {
  const product = await Product.findById(productId);
  if (!product) return responseUtils.notFound(response);

  await Product.deleteOne({ _id: productId });
  return responseUtils.sendJson(response, product);
};