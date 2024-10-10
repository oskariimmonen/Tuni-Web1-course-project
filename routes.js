const http = require('http');
const responseUtils = require('./utils/responseUtils');
const { acceptsJson } = require('./utils/requestUtils');
const { renderPublic } = require('./utils/render');
const userService = require('./services/userService');
const productService = require('./services/productService');
const orderService = require('./services/orderService');

/**
 * Known API routes and their allowed methods
 *
 * Used to check allowed methods and also to send correct header value
 * in response to an OPTIONS request by sendOptions() (Access-Control-Allow-Methods)
 */
const allowedMethods = {
  '/api/register': ['POST'],
  '/api/users': ['GET', 'PUT', 'DELETE'],
  '/api/products': ['GET', 'POST', 'PUT', 'DELETE'],
  '/api/orders': ['GET', 'POST']
};


// Handles incoming request and calls other methods based on the URL path and http request method
const handleRequest = async(request, response) => {
  const { url, method, headers } = request;
  const filePath = new URL(url, `http://${headers.host}`).pathname;

  // serve static files from public/ and return immediately
  if (method.toUpperCase() === 'GET' && !filePath.startsWith('/api')) {
    const fileName = filePath === '/' || filePath === '' ? 'index.html' : filePath;
    return renderPublic(fileName, response);
  }

  // GET | PUT | DELETE - /api/users/{userId}
  if (filePath.includes('/api/users') && matchIdRoute(filePath, 'users')) {
    // Require a correct accept header (require 'application/json' or '*/*')
    // Check auth before contentType because of PUT test where contentType is not defined
    if (!request?.headers?.authorization) return responseUtils.basicAuthChallenge(response);
    if (!acceptsJson(request)) return responseUtils.contentTypeNotAcceptable(response);
    const userId = (url.split('/'))[3];
    switch(method.toUpperCase()) {
      case 'GET':
        return await userService.getUserById(request, response, userId);
      case 'PUT':
        return await userService.updateUser(request, response, userId);
      case 'DELETE':
        return await userService.deleteUser(request, response, userId);
    }
  }

  // GET | PUT | DELETE - /api/products/{productId}
  if (filePath.includes('/api/products') && matchIdRoute(filePath, 'products')) {
    // Require a correct accept header (require 'application/json' or '*/*')
    // Check auth before contentType because of PUT test where contentType is not defined
    if (!request?.headers?.authorization) return responseUtils.basicAuthChallenge(response);
    if (!acceptsJson(request)) return responseUtils.contentTypeNotAcceptable(response);
    const productId = (url.split('/'))[3];
    switch(method.toUpperCase()) {
      case 'GET':
        return await productService.getProductById(request, response, productId);
      case 'PUT':
        return await productService.updateProduct(request, response, productId);
      case 'DELETE':
        return await productService.deleteProduct(request, response, productId);
    }
  }

  // GET - /api/orders/{orderId}
  if (filePath.includes('/api/orders') && matchIdRoute(filePath, 'orders')) {
    // Require a correct accept header (require 'application/json' or '*/*')
    if (!acceptsJson(request)) return responseUtils.contentTypeNotAcceptable(response);
    const orderId = (url.split('/'))[3];
    switch(method.toUpperCase()) {
      case 'GET':
        return await orderService.getOrderById(request, response, orderId);
    }
  }

  // Default to 404 Not Found if unknown url
  if (!(filePath in allowedMethods)) return responseUtils.notFound(response);

  // See: http://restcookbook.com/HTTP%20Methods/options/
  if (method.toUpperCase() === 'OPTIONS') return sendOptions(filePath, response);

  // Check for allowable methods
  if (!allowedMethods[filePath].includes(method.toUpperCase())) {
    return responseUtils.methodNotAllowed(response);
  }

  if (!acceptsJson(request)) return responseUtils.contentTypeNotAcceptable(response);

  // GET users
  if (url === '/api/users' && method.toUpperCase() === 'GET') {
    return await userService.getAllUsers(request, response);
  }

  // POST user
  if (url === '/api/register' && method.toUpperCase() === 'POST') {
    return await userService.registerUser(request, response);
  }

  // GET all products
  if (url === '/api/products' && method.toUpperCase() === 'GET') {
    return await productService.getAllProducts(request, response);
  }

  // POST product
  if (url === '/api/products' && method.toUpperCase() === 'POST') {
    return await productService.createProduct(request, response);
  }

  // GET orders
  if (url === '/api/orders' && method.toUpperCase() === 'GET') {
    return await orderService.getAllOrders(request, response);
  }

  // POST order
  if (url === '/api/orders' && method.toUpperCase() === 'POST') {
    return await orderService.createOrder(request, response);
  }
};

/**
 * Send response to client options request.
 *
 * @param {string} filePath pathname of the request URL
 * @param {http.ServerResponse} response http response
 * @returns {http.ServerResponse} response
 */
 function sendOptions(filePath, response) {
  if (filePath in allowedMethods) {
    response.writeHead(204, {
      'Access-Control-Allow-Methods': allowedMethods[filePath].join(','),
      'Access-Control-Allow-Headers': 'Content-Type,Accept',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Expose-Headers': 'Content-Type,Accept'
    });
    return response.end();
  }

  return responseUtils.notFound(response);
}

/**
 * Does the url have an ID component as its last part? (e.g. /api/users/dsf7844e)
 *
 * @param {string} url filePath
 * @param {string} prefix api controller name
 * @returns {boolean} returns true if id is included route, else false
 */
function matchIdRoute(url, prefix) {
  const idPattern = '[0-9a-z]{8,24}';
  const regex = new RegExp(`^(/api)?/${prefix}/${idPattern}$`);
  return regex.test(url);
}

module.exports = { handleRequest };