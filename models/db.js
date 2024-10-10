const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Get database connect URL.
 *
 * Reads URL from DBURL environment variable or
 * returns default URL if variable is not defined
 *
 * @returns {string} connection URL
 */
const getDbUrl = () => {
  const dbUrl = process.env.DBURL || 'mongodb://localhost:27017/WebShopDb';
  console.log(`Connected to database running in ${dbUrl}`);
  return dbUrl;
};

const connectDB = () => {
  // Do nothing if already connected
  if (!mongoose.connection || mongoose.connection.readyState === 0) {
    mongoose
      .connect(getDbUrl(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        autoIndex: true
      })
      .then(() => {
        mongoose.connection.on('error', err => {
          console.error(err);
        });

        mongoose.connection.on('reconnectFailed', handleCriticalError);
      })
      .catch(handleCriticalError);
  }
};

const handleCriticalError = (err) => {
  console.error(err);
  throw err;
};

const disconnectDB = () => {
  mongoose.disconnect();
};

module.exports = { connectDB, disconnectDB, getDbUrl };