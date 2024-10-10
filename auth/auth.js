const http = require('http');
const User = require('../models/user');
const requestUtils = require('../utils/requestUtils');
const responseUtils = require('../utils/responseUtils');
/**
 * Get current user based on the request headers
 *
 * @param {http.IncomingMessage} request http request
 * @returns {object|null} current authenticated user or null if not yet authenticated
 */
const getCurrentUser = async request => {
  if (!request.headers?.authorization) return null;

  const credentials = requestUtils.getCredentials(request);
  if (credentials === null || credentials.length < 2) return null;

  try {
    const user = await User.findOne({ email: credentials[0]});
    if (!user) return null;

    const passwordOk = await user.checkPassword(credentials[1]);
    if (!passwordOk) return null;

    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = { getCurrentUser };