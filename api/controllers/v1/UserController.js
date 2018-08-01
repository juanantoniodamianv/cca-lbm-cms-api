/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');
/* var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('tctDZd_F9FWKd4Csq32LEg'); */
/* var Mandrill = require('machinepack-mandrill');
 */

module.exports = {
  _config: {
    model: 'user'
  },

  create: async function (req, res) {
    //if (!(User.isAdmin(req.current_user))) return ResponseService.json(400, res, "You need signed in with an administrator user type to perform this action.");
    if (req.body.password !== req.body.confirmPassword) {
      return ResponseService.json(401, res, "Password doesn't match")
    }

    var allowedParameters = [
      "email", "password", "firstName", "lastName", "userType", "organization"
    ]

    var data = _.pick(req.body, allowedParameters);

    var newUser = await User.create(data)
      .intercept('E_UNIQUE', (err) => {
        return ResponseService.json(400, res, "User could not be created: email already in use.", err)
      })
      .intercept('UsageError', (err) => {
        return ResponseService.json(400, res, "User could not be created: invalid data.", err)
      })
      .fetch();
    sails.log.info(newUser);
    var responseData = {
      user: newUser,
      token: JwtService.issue({id: newUser.id})
    }
    return ResponseService.json(200, res, "User created successfully", responseData)
  },

/*   index: async (req, res, next) => {
    var totalCount;
    var options = {
      limit: req.param('limit') || undefined,
      skip: req.param('skip') || undefined,
      sort: req.param('sort') || "createdAt desc" // columnName desc||asc
    };
		await User.getTotalCount().then(count => { totalCount = count })
    var users = await User.find({
                  skip: options.skip,
                  limit: options.limit,
                  sort: options.sort,
                }).intercept('UsageError', (err) => {
                  return ResponseService.json(400, res, "Users could not be found: invalid data.", err)
                });
    var responseData = {
      users, 
      skip: options.skip,
      limit: options.limit,
      total: totalCount || 0
    }
    if (responseData.total === 0) return ResponseService.json(204, res, responseData)
    return ResponseService.json(200, res, responseData)
  }, */

  index: async (req, res, next) => {
    var totalCount;
    var responseData = {};
    var options = {
      limit: req.param('limit') || undefined,
      skip: req.param('skip') || undefined,
      sort: req.param('sort') || "createdAt desc" // columnName desc||asc
    };
		await User.getTotalCount().then(count => { 
      totalCount = count;
      responseData = {
        total: totalCount || 0
      };
    })
    
    await User.find({
               skip: options.skip,
               limit: options.limit,
               sort: options.sort,
          }).intercept('UsageError', (err) => {
             return ResponseService.json(400, res, "Users could not be found: invalid data.", err)
          }).then(users => {
      			responseData = {
              users,
              skip: options.skip,
      				limit: options.limit
            }
    			})
    return responseData.total == 0 ? ResponseService.json(204, res, responseData) : ResponseService.json(200, res, responseData);
 },

  search: (req, res, next) => {
    var searchObj = {};
    searchObj[req.param('criteria')] = req.param('value');
    sails.log.info(searchObj);
    let criteria = req.param('criteria');
    let value = req.param('value');
    sails.log.info(criteria);
    sails.log.info(value);
    User.find()
    .where({ criteria : { contains : value } })
    .exec((err, users) => {
      if (err) return next(err);
      var responseData = {
        users, 
        total: users.length
      }
      return ResponseService.json(200, res, responseData)
    });
  },

  show: (req, res, next) => {
    User.findOne(req.param('id'), (err, user) => {
      if (err) return next(err);
      if (!user) return ResponseService.json(404, res, "User not exist.", err)
      var responseData = {
        user
      }
      return ResponseService.json(200, res, responseData)
    });
  },

  getMe: (req, res, next) => {
    User.findOne({ email: req.current_user.email }, function foundUser (err, user) {
      if (err) return next(err);
      if (!user) return next();
      var responseData = {
        user
      }
      return ResponseService.json(200, res, responseData)
    });
  },

  // Render the edit view - not for api

  edit: function (req, res, next) {
    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) return next(err);
      if (!user) return next('User doesn\'t exist.');
      var responseData = {
        user: user
      }
      return ResponseService.json(200, res, responseData)
    });
  },

  update: function (req, res, next) {
    User.update(req.param('id'), req.allParams(), function userUpdated (err, user) {
      if (err) return ResponseService.json(400, res, "User could not be updated", err.Errors)
      var responseData = {
        user: user
      }
      return ResponseService.json(200, res, "User updated successfully", responseData)
    })
  },

  /* Destroy user account */
  destroy: (req, res, next) => {
    if (!(User.isAdmin(req.current_user))) return ResponseService.json(400, res, "You need administrator privileges to perform this action.");
    User.destroy(req.param('id'), function userDestroyed (err, user){
      if (err) return ResponseService.json(400, res, "User could not be destroyed", err.Errors)
      var responseData = {
        user
      }
      return ResponseService.json(200, res, "User destroyed succesfully", responseData)
    })
  },

  // Reset password
  sendPasswordRecoveryEmail: async function (req, res, next) {
    var userRecord = await User.findOne({email: req.body.email});

    if (!userRecord) {
      return ResponseService.json(401, res, "This email is not registered.")
    }

    var token = JwtService.issue({id: userRecord.id});
    User.update({ id: userRecord.id }, {
      passwordResetToken: token,
      passwordResetTokenExpiresAt: Date.now() + 24*60*60*1000,
    }).exec((err,update)=>{
      if(err) {
        throw new Error(err);
      }
    });

    // Send recovery email
    User.sendEmailForgotPassword(userRecord, token);
    return ResponseService.json(200, res, "The instruction to reset your password has been sent to your email.") 
  },

  resetPassword: async function (req, res, next) {
    // Is valid token?
    var userRecord = await User.findOne({ passwordResetToken: req.param('token')});
    //console.log(`User: ${userRecord.email}`);
    if (!userRecord || userRecord === undefined || userRecord.passwordResetTokenExpiresAt <= Date.now()) {
      return ResponseService.json(401, res, "The provided password token is invalid, expired, or has already been used.");
    }

    if (req.body.password !== req.body.confirmPassword) {
      return ResponseService.json(401, res, "Password doesn't match")
    }    
    
    /*
    password,
    confirmPassword,
    passwordResetToken: '',
    passwordExpiresAt: 0
    */
    var allowedParameters = [
      "password", "passwordResetToken", "passwordResetTokenExpiresAt"
    ]
    req.body.passwordResetToken = '';
    req.body.passwordResetTokenExpiresAt = 0;
    var data = _.pick(req.body, allowedParameters);
    
    User.update(userRecord.id, data, function userUpdated (err, user) {
      if (err) return ResponseService.json(400, res, "Password could not be updated", error.Errors)
      var responseData = {
        user: user
      }
      return ResponseService.json(200, res, "Password updated successfully", responseData)
    });

  } 
};