const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// You can use SALT_ROUNDS when hashing the password with bcrypt.hashSync()
const SALT_ROUNDS = 10;

// You can use these SCHEMA_DEFAULTS when setting the validators for the User Schema. For example the default role can be accessed with SCHEMA_DEFAULTS.role.defaultValue
const SCHEMA_DEFAULTS = {
  name: {
    minLength: 1,
    maxLength: 50
  },
  email: {
    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: {
    minLength: 10
  },
  role: {
    values: ['admin', 'customer'],
    defaultValue: 'customer'
  }
};

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: SCHEMA_DEFAULTS.name.minLength,
    maxLength: SCHEMA_DEFAULTS.name.maxLength
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: SCHEMA_DEFAULTS.email.match
  },
  password: {
    type: String,
    required: true,
    minLength: 10,
    set: password => {
      if (password.length < 10) { 
        return password;
      }
      return bcrypt.hashSync(password);
    }
  },
  role: {
    type: String,
    enum: SCHEMA_DEFAULTS.role.values,
    default: SCHEMA_DEFAULTS.role.defaultValue,
    required: true,
    trim: true,
    lowercase: true
  }
});

/**
 * Compare supplied password with user's own (hashed) password
 *
 * @param {string} password password to be hashed
 * @returns {Promise<boolean>} promise that resolves to the comparison result
 */
userSchema.methods.checkPassword = async function(password) {
  // Here you should return the result you get from bcrypt.compare() function. Remember to await! :-)
  return await bcrypt.compare(password, this.password);
};

// Omit the version key when serialized to JSON
userSchema.set('toJSON', { virtuals: false, versionKey: false });

const User = mongoose.model('User', userSchema);
module.exports = User;