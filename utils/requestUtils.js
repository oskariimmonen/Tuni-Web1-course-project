const http = require('http');
/**
 * Decode, parse and return user credentials (username and password)
 * from the Authorization header.
 *
 * @param {http.incomingMessage} request request
 * @returns {Array|null} [username, password] or null if header is missing
 */
 const getCredentials = request => {
  // TODO: 8.5 Parse user credentials from the "Authorization" request header
  // NOTE: The header is base64 encoded as required by the http standard.
  //       You need to first decode the header back to its original form ("email:password").
  //  See: https://attacomsian.com/blog/nodejs-base64-encode-decode
  //       https://stackabuse.com/encoding-and-decoding-base64-strings-in-node-js/
  //throw new Error('Not Implemented');
  if(request.headers.authorization === undefined) {
    return null;
  }
  const authHeader = request.headers.authorization.split(" ");
  if ((authHeader[0] === undefined) || (authHeader[1] === undefined) || (authHeader[0] !== "Basic")) {
    return null;
  }
  else {
    const buff = Buffer.from(authHeader[1], 'base64');
    let credentials = buff.toString('ascii');
    credentials = credentials.split(":");
    return credentials;
  }
};

/**
 * Does the client accept JSON responses?
 *
 * @param {http.incomingMessage} request request
 * @returns {boolean} true if client accepts JSON, else false
 */
const acceptsJson = request => {
  //Check if the client accepts JSON as a response based on "Accept" request header
  // NOTE: "Accept" header format allows several comma separated values simultaneously
  // as in "text/html,application/xhtml+xml,application/json,application/xml;q=0.9,*/*;q=0.8"
  // Do not rely on the header value containing only single content type!
  const acceptHeader = request.headers.accept || '';
  return acceptHeader.includes('application/json') || acceptHeader.includes('*/*');
};

/**
 * Is the client request content type JSON?
 *
 * @param {http.incomingMessage} request request
 * @returns {boolean}true if request content type is JSON, else false
 */
const isJson = request => {
  // Check whether request "Content-Type" is JSON or not
  const contentType = request.headers['content-type'] || '';
  return contentType.toLowerCase() === 'application/json';
};

/**
 * Asynchronously parse request body to JSON
 *
 * Remember that an async function always returns a Promise which
 * needs to be awaited or handled with then() as in:
 *
 *   const json = await parseBodyJson(request);
 *
 *   -- OR --
 *
 *   parseBodyJson(request).then(json => {
 *     // Do something with the json
 *   })
 *
 * @param {http.IncomingMessage} request response
 * @returns {Promise<*>} Promise resolves to JSON content of the body
 */
const parseBodyJson = request => {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('error', err => reject(err));

    request.on('data', chunk => {
      body += chunk.toString();
    });

    request.on('end', () => {
      resolve(JSON.parse(body));
    });
  });
};

module.exports = { acceptsJson, getCredentials, isJson, parseBodyJson };