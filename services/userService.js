const http = require('http');
const responseUtils = require('../utils/responseUtils');
const requestUtils = require('../utils/requestUtils');
const auth = require('../auth/auth');
const userController = require('../controllers/users');

/**
 * Returs all users if user is auhtenticated and authorized
 * Calls userController
 * 
 * @param {http.ServerRequest} request http request
 * @param {http.ServerResponse} response http response
 * @returns {http.ServerResponse} response
 */
exports.getAllUsers = async (request, response) => {
   const currentUser = await auth.getCurrentUser(request);
   if (!currentUser) return responseUtils.basicAuthChallenge(response);
   if (currentUser.role !== "admin") return responseUtils.forbidden(response);

   return await userController.getAllUsers(response);
};

/**
 * Get user by id. Calls orderController
 * 
 * @param {http.ServerRequest} request http request
 * @param {http.ServerResponse} response http response
 * @param {string} userId id of target user
 * @returns {http.ServerResponse} response
 */
exports.getUserById = async (request, response, userId) => {
   const currentUser = await auth.getCurrentUser(request);
   if (!currentUser) return responseUtils.basicAuthChallenge(response);
   if (currentUser.role !== "admin") return responseUtils.forbidden(response);

   const targetUser = await userController.getUserObjectById(userId);
   if (!targetUser) return responseUtils.notFound(response);

   return await userController.viewUser(response, userId);
};

/**
 * Update user by id. Calls orderController
 * 
 * @param {http.ServerRequest} request http request
 * @param {http.ServerResponse} response http response
 * @param {string} userId id of target user
 * @returns {http.ServerResponse} response
 */
exports.updateUser = async (request, response, userId) => {
   const currentUser = await auth.getCurrentUser(request);
   if (!currentUser) return responseUtils.basicAuthChallenge(response);
   if (currentUser.role !== "admin") return responseUtils.forbidden(response);

   const targetUser = await userController.getUserObjectById(userId);
   if (!targetUser) return responseUtils.notFound(response);

   const roles = ['admin', 'customer'];

   const body = await requestUtils.parseBodyJson(request);
   if (!body || !body.role || !roles.includes(body.role) || userId === currentUser.id) {
      return responseUtils.badRequest(response, "400 Bad Request");
   }

   return await userController.updateUser(response, userId, currentUser, body);
};

/**
 * Deletes user by id. Calls orderController
 * 
 * @param {http.ServerRequest} request http request
 * @param {http.ServerResponse} response http response
 * @param {string} userId id of target user
 * @returns {http.ServerResponse} response
 */
exports.deleteUser = async (request, response, userId) => {
   const currentUser = await auth.getCurrentUser(request);
   if (!currentUser) return responseUtils.basicAuthChallenge(response);
   if (currentUser.role !== "admin") return responseUtils.forbidden(response);


   const targetUser = await userController.getUserObjectById(userId);
   if (!targetUser) return responseUtils.notFound(response);

   if (userId === currentUser.id) return responseUtils.badRequest(response, "400 Bad Request");

   return await userController.deleteUser(response, userId, currentUser);
};
 
/**
 * Creates a new user. Calls orderController
 * 
 * @param {http.ServerRequest} request http request
 * @param {http.ServerResponse} response http response
 * @returns {http.ServerResponse} response
 */
exports.registerUser = async (request, response) => {
   // Fail if not a JSON request, don't allow non-JSON Content-Type
   if (!requestUtils.isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
   }

   const newUser = await requestUtils.parseBodyJson(request);
   const emailIsInUse = await userController.emailIsInUse(newUser?.email);
   if (emailIsInUse || !newUser?.email || !newUser?.name || !newUser?.password) {
      return responseUtils.badRequest(response, '400 Bad Request');
   }
   
   newUser.role = 'customer';
   return await userController.registerUser(response, newUser);
};
