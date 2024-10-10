const mongoose = require('mongoose');
require('dotenv').config();

const dbConfig = {
  host: 'localhost',
  port: 27017,
  db: 'Test_WebShopDb'
};

/**
 * Get database connect URL.
 *
 * Reads URL from DBURL environment variable or
 * returns default URL if variable is not defined
 *
 * @returns {string} connection URL
 */
 const getDbUrl = () => {
  const dbUrl = (process.env.DBURL !== undefined) ? process.env.DBURL : "mongodb://mongo:27017/WebShopDb";
  console.log(`Connected to database running in ${dbUrl}`);
  return dbUrl;
};

/**
 * Run before all tests
 */
const beforeAll = async () => {
  const clearDb = async () => {
    for (const i in mongoose.connection.collections) {
      await mongoose.connection.collections[i].deleteMany({});
    }
  };

  if (!mongoose.connection || mongoose.connection.readyState === 0) {
    await mongoose.connect(getDbUrl() /*`mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.db}`*/, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });

    mongoose.connection.on('error', err => {
      console.error(err);
    });

    mongoose.connection.on('reconnectFailed', err => {
      throw err;
    });
  }

  return await clearDb();
};

/**
 * Run after all tests
 */
const afterAll = done => {
  mongoose.disconnect();
  done();
};

module.exports.mochaHooks = { beforeAll, afterAll };
