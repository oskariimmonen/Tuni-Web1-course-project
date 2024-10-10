const http = require('http');
const responseUtils = require('../utils/responseUtils');
const Order = require('../models/order');

/**
 * Send all orders as JSON
 * 
 * If customerId is give, only returns orders of said customer
 *
 * @param {http.ServerResponse} response http response
 * @param {string} customerId null by default. customer id, if request is made by user with role customer. Then only orders of said customer is returned
 * @returns {http.ServerResponse} response
 */
exports.getAllOrders = async (response, customerId = null) => {
   try {
      let orders = [];
      if (customerId) {
         orders = await Order.find({ 'customerId': customerId });   
      } else {
         orders = await Order.find({});
      }
      return responseUtils.sendJson(response, orders);
   }
   catch (err) {
      console.log(err);
      return responseUtils.internalServerError(response);
   }
};

/**
 * View order specified by id
 * 
 * @param {http.ServerResponse} response http response
 * @param {string} orderId id of the order that is fetched
 * @param {string} customerId null by default. customer id, if request is made by user with role customer. Customer can get only their own order.
 * @returns {http.ServerResponse} response
 */
exports.viewOrder = async (response, orderId, customerId = null) => {
   try {
      const order = await Order.findById(orderId);
      // If order is not found or requesting user is customer and found order is made by other customer 
      if (!order || (customerId && !customerId.equals(order.customerId))) {
         return responseUtils.notFound(response);
      }
      return responseUtils.sendJson(response, order);
   } catch (err) {
      console.log(err);
      return responseUtils.internalServerError(response);
   }
};

/**
 * Create a new order
 * 
 * @param {http.ServerResponse} response http response
 * @param {object} body of the order. Check  docs/api.html
 * @returns {http.ServerResponse} response
 */
exports.createOrder = async (response, body) => {
   try {
      const newOrderObject = new Order(body);
      await newOrderObject.save();
      return responseUtils.createdResource(response, newOrderObject);
   } catch (err) { // If request body is not okay. This is lazy, but works.
      return responseUtils.badRequest(response, "400 Bad Request");
   }
};