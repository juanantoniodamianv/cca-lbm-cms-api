/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var Promise = require("bluebird");
var bcrypt = require("bcrypt")

module.exports = {

  attributes: {
    email: {
      type: "string",
      required: true,
      unique: true,
      columnType: 'string'
    },
    password: {
      type: "string",
      minLength: 6,
      required: true,
      columnName: "encryptedPassword"
    },
    firstName: {
      type: "string",
      minLength: 2
    },
    lastName: {
      type: "string",
      minLength: 2
    },
    userType: {
      type: "string",
      isIn: ['admin', 'normal'],
      defaultsTo: 'normal'
    },
    organization: {
      type: "string",
      minLength: 2
    },
    passwordResetToken: {
      type: "string",
    },
    passwordResetTokenExpiresAt: {
      type: "number"
    },
  },

  customToJSON: function() {
    return _.omit(this, 'password');
  },

  beforeCreate: async (values, cb) => {
    bcrypt.hash(values.password, 10, function (err, hash) {
      if (err) return cb(err);
      values.password = hash;
      cb();
    });
  },

  beforeUpdate: function(values, cb){
    if(values.password) {
      bcrypt.hash(values.password, 10, function (err, hash) {
        if (err) return cb(err);
        values.password = hash;
        cb();
      })
    } else {
      cb();
    }
  },

  comparePassword: function (password, user) {
    return new Promise(function (resolve, reject) {
      bcrypt.compare(password, user.password, function (err, match) {
        if (err) reject(err);

        if (match) {
          resolve(true);
        } else {
          reject(err);
        }
      })
    });
  },

/*   findUser: async (email) => {
    var userRecord = await User.findOne({email});
    //sails.log.info(userRecord);
    return userRecord;
  }, */

};

