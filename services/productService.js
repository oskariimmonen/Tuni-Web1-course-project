const http = require('http');
const responseUtils = require('../utils/responseUtils');
const requestUtils = require('../utils/requestUtils');
const auth = require('../auth/auth');
const productController = require('../controllers/products');
const userController = require('../controllers/users');

/**
 * Returns all products if user is admin or all customers own orders. 
 * Calls productController
 * 
 * @param {http.ServerRequest} request http request
 * @param {http.ServerResponse} response http response
 * @returns {http.ServerResponse} response
 */
exports.getAllProducts = async (request, response) => {
  //  if (!requestUtils.isJson(request)) {
  //    return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
  //  }

   const currentUser = await auth.getCurrentUser(request);
   if (!currentUser) return responseUtils.basicAuthChallenge(response);
 
   const allowedRoles = ["customer", "admin"];
 
   if (!allowedRoles.includes(currentUser.role)) return responseUtils.forbidden(response);
 
   // All above checks are okay
   return productController.getAllProducts(response);
 };

/**
 * Get product by id. Calls productController
 * 
 * @param {http.ServerRequest} request http request
 * @param {http.ServerResponse} response http response
 * @param {string} productId id of target product
 * @returns {http.ServerResponse} response
 */
exports.getProductById = async (request, response, productId) => {
  const currentUser = await auth.getCurrentUser(request);
  if (!currentUser) return responseUtils.basicAuthChallenge(response);

  return await productController.viewProduct(response, productId);
};

/**
 * Creates a new product. Calls productController
 * 
 * @param {http.ServerRequest} request http request
 * @param {http.ServerResponse} response http response
 * @returns {http.ServerResponse} response
 */
exports.createProduct = async (request, response) => {
  // Fail if not a JSON request, don't allow non-JSON Content-Type
  if (!requestUtils.isJson(request)) {
     return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
  }

  const currentUser = await auth.getCurrentUser(request);
  if (!currentUser) return responseUtils.basicAuthChallenge(response);
  if (currentUser.role !== "admin") return responseUtils.forbidden(response);

  const body = await requestUtils.parseBodyJson(request);
  if (!productBodyOk(body) || !body?.name || !body?.price) {
    return responseUtils.badRequest(response, '400 Bad Request');
  }
  
  return await productController.createProduct(response, body);
};

/**
 * Updates product by id. Calls productController
 * 
 * @param {http.ServerRequest} request http request
 * @param {http.ServerResponse} response http response
 * @param {string} productId id of target product
 * @returns {http.ServerResponse} response
 */
exports.updateProduct = async (request, response, productId) => {
  const currentUser = await auth.getCurrentUser(request);
  if (!currentUser) return responseUtils.basicAuthChallenge(response);
  if (currentUser.role !== "admin") return responseUtils.forbidden(response);

  const body = await requestUtils.parseBodyJson(request);
  if (!productBodyOk(body)) return responseUtils.badRequest(response, "400 Bad Request");

  return await productController.updateProduct(response, productId, body);
};

/**
 * Deletes product by id. Calls productController
 * 
 * @param {http.ServerRequest} request http request
 * @param {http.ServerResponse} response http response
 * @param {string} productId id of target product
 * @returns {http.ServerResponse} response
 */
exports.deleteProduct = async (request, response, productId) => {
  const currentUser = await auth.getCurrentUser(request);
  if (!currentUser) return responseUtils.basicAuthChallenge(response);
  if (currentUser.role !== "admin") return responseUtils.forbidden(response);

  return await productController.deleteProduct(response, productId);
};

/**
 * Checks that product object contains required attributes in right form
 * 
 * @param {object} body request body. Should be product object
 * @returns {boolean} true if body ok, else false
 */
function productBodyOk(body) {
  let isOkay = !!body;
  isOkay = isOkay && (!body.price || typeof body.price === 'number' && body.price > 0);
  isOkay = isOkay && body.name && body.name.length > 0;
  return isOkay;
}