const http = require('http');
const responseUtils = require('../utils/responseUtils');
const User = require("../models/user");

const SCHEMA_DEFAULTS = {
  password: {
    minLength: 10
  }
};

/**
 * Send all users as JSON
 *
 * @param {http.ServerResponse} response http request
 * @returns {http.ServerResponse} response http response
 */
const getAllUsers = async response => {
  const users = await User.find();
  return responseUtils.sendJson(response, users); 
};

/**
 * Send user data as JSON
 *
 * @param {http.ServerResponse} response http request
 * @param {string} userId target users id
 * @param {object} currentUser (mongoose document object)
 * @returns {http.ServerResponse} response http response
 */
 const viewUser = async(response, userId, currentUser) => {
  const user = await User.findById(userId);
  if (!user) return responseUtils.notFound(response);
  return responseUtils.sendJson(response, user);
};

/**
 * Register new user and send created user back as JSON
 *
 * @param {http.ServerResponse} response http request
 * @param {object} userData JSON data from request body
 * @returns {http.ServerResponse} response http response
 */
 const registerUser = async(response, userData) => {

  if (!userData || !userData?.email || !userData?.name || !userData?.password) 
    return responseUtils.badRequest(response, "400 Bad Request");

  const emailIsInUse = await User.findOne({ email: userData.email }) !== null;
  const passwordTooShort = userData.password.length < SCHEMA_DEFAULTS.password.minLength;
  if (passwordTooShort || emailIsInUse) return responseUtils.badRequest(response, "400 Bad Request");
  
  userData.role = 'customer';
  try {
    const newUserObject = new User(userData);
    const returnedObject = await newUserObject.save();
    return responseUtils.createdResource(response, returnedObject);
  } catch (err) {
    return responseUtils.badRequest(response, "400 Bad Request");
  }
};

/**
 * Update user and send updated user as JSON
 *
 * @param {http.ServerResponse} response http request
 * @param {string} userId target users id
 * @param {object} currentUser (mongoose document object)
 * @param {object} userData JSON data from request body
 * @returns {http.ServerResponse} response http response
 */
 const updateUser = async(response, userId, currentUser, userData) => {
  const user = await User.findById(userId);
  if (!user) 
    return responseUtils.notFound(response);
  if (!userData || !userData.role || (userData.role !== 'admin' && userData.role !== 'customer')) {
    return responseUtils.badRequest(response, "400 Bad Request");
  }
  if (userId === currentUser.id) 
    return responseUtils.badRequest(response, 'Updating own data is not allowed');

  user.role = userData.role;
  await user.save();
  return responseUtils.sendJson(response, user);
};

/**
 * Delete user and send deleted user as JSON
 *
 * @param {http.ServerResponse} response http request
 * @param {string} userId target users id
 * @param {object} currentUser (mongoose document object)
 * @returns {http.ServerResponse} response http response
 */
const deleteUser = async(response, userId, currentUser) => {
  const user = await User.findById(userId);
  if (!user)
    return responseUtils.notFound(response);

  if (userId === currentUser.id)
    return responseUtils.badRequest(response, "400 Bad Request");

  await User.deleteOne({ _id: userId });
  return responseUtils.sendJson(response, user);
};

/**
 * Checks if given email is already in use
 * 
 * @param {string} userEmail  target users email
 * @returns {boolean} in user or not
 */
const emailIsInUse = async (userEmail) => {
  return await User.findOne({ email: userEmail }) !== null;
};

/**
 * Returns user object with given id if found
 * 
 * @param {string} userId target users id
 * @returns {null | object} null or user 
 */
const getUserObjectById = async (userId) => {
  return await User.findById(userId);
};

module.exports = { getAllUsers, registerUser, deleteUser, viewUser, updateUser, emailIsInUse, getUserObjectById };