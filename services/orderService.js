const http = require('http');
const responseUtils = require('../utils/responseUtils');
const requestUtils = require('../utils/requestUtils');
const auth = require('../auth/auth');
const orderController = require('../controllers/orders');

/**
 * Returns all orders if user is admin or all customers own orders. 
 * Calls orderController
 * 
 * @param {http.ServerRequest} request http request
 * @param {http.ServerResponse} response http response
 * @returns {http.ServerResponse} response
 */
exports.getAllOrders = async (request, response) => {

   const currentUser = await auth.getCurrentUser(request);
   if (!currentUser) return responseUtils.basicAuthChallenge(response);

   if (currentUser && currentUser.role === 'admin') {
      return orderController.getAllOrders(response);
   }
   if (currentUser && currentUser.role === 'customer') {
     return orderController.getAllOrders(response, currentUser._id);
   }
   return responseUtils.unauthorized(response);
};

/**
 * Get order by id. Calls orderController
 * 
 * @param {http.ServerRequest} request http request
 * @param {http.ServerResponse} response http response
 * @param {string} orderId id of target order
 * @returns {http.ServerResponse} response
 */
exports.getOrderById = async (request, response, orderId) => {
   const currentUser = await auth.getCurrentUser(request);
   if (!currentUser) return responseUtils.basicAuthChallenge(response);

   if (currentUser && currentUser.role === 'admin') {
      return orderController.viewOrder(response, orderId);
   }
   if (currentUser && currentUser.role === 'customer') {
      return orderController.viewOrder(response, orderId, currentUser._id);
   }
   return responseUtils.unauthorized(response);
};

/**
 * Creates new order. Calls orderController
 * 
 * @param {http.ServerRequest} request http request
 * @param {http.ServerResponse} response http response
 * @returns {http.ServerResponse} response
 */
exports.createOrder = async (request, response) => {
   // Fail if not a JSON request, don't allow non-JSON Content-Type
   if (!requestUtils.isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
   }

   const currentUser = await auth.getCurrentUser(request);
   if (!currentUser) return responseUtils.basicAuthChallenge(response);
   if (currentUser.role !== "customer") return responseUtils.forbidden(response);

   const body = await requestUtils.parseBodyJson(request);
   body.customerId = currentUser._id;
   if (!body || !body?.items || body?.items.length < 1 || body?.items.some(e => !e?.product?._id)) {
      return responseUtils.badRequest(response, "400 Bad Request");
   }

   return await orderController.createOrder(response, body);
};