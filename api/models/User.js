/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var Promise = require("bluebird");
var bcrypt = require("bcrypt");
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('tctDZd_F9FWKd4Csq32LEg');

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

  getTotalCount: async () => {
    var totalCount = await User.count();
    if (totalCount) { totalCount = +totalCount; }
		return totalCount;
	},

/*   findUser: async (email) => {
    var userRecord = await User.findOne({email});
    //sails.log.info(userRecord);
    return userRecord;
  }, */

  isAdmin: (current_user) => {
    return current_user.userType !== 'admin' ? false : true; 
  },

  sendEmailForgotPassword: (userRecord, token) => {
    let url = "https://cca-lbm-dev.ballastlane.com/#/reset?token=" + token;
    let receiveName = userRecord.lastName || userRecord.firstName || userRecord.email;
    var message = {
      "html": "<div><p>Dear " + receiveName + "</p><p>Hi! We recently had a request to reset your account password at CCA-CMS.</p><p>If you see that the above information is not correct, contact us at support@ballastlane.com</p></div><div><p>To reset your password account, click on the following link <a href='" + url + "'>here</a></p></div>",
      "subject": "Forgot password?",
      "from_email": "support@ballastlane.com",
      "from_name": "Support Ballastlane - CCA CMS",
      "to": [{
        "email": userRecord.email,
        "name": userRecord.lastName + ', ' + userRecord.firstName,
        "type": "to"
      }],
      "important": true,
      "tags": [
        "password-resets"
      ],
    };
    var async = false;
    mandrill_client.messages.send({"message": message, "async": async}, (result) => {
      console.log(result);
      /*
      [{
              "email": "recipient.email@example.com",
              "status": "sent",
              "reject_reason": "hard-bounce",
              "_id": "abc123abc123abc123abc123abc123"
          }]
      */
    }, (e) => {
      // Mandrill returns the error as an object with name and message keys
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
      // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
  },

};

