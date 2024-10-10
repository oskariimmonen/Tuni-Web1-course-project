const path = require('path');
const dotEnvPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: dotEnvPath });

const { connectDB, disconnectDB } = require('../models/db');
const User = require('../models/user');

const users = require('./users.json').map(user => ({ ...user }));
const products = require('./products.json').map(product => ({ ...product }));

(async () => {
  connectDB();

  try {
    const Order = require('../models/order');
    const orderDeleteStats = await Order.deleteMany({});
    console.log("Orders deleted: ", orderDeleteStats);
  } catch (error) {
    console.log(error)
  }
  
  try {
    const Product = require('../models/product');
    const productDeleteStats = await Product.deleteMany({});
    console.log("Products deleted: ", productDeleteStats);
    await Product.create(products);
    console.log('Created products');
  } catch (error) {
    console.log(error)
  }
  
  const usersDeleteStats = await User.deleteMany({});
  console.log("Users deleted: ", usersDeleteStats);
  await User.create(users);
  console.log('Created users');

  disconnectDB();
})();
