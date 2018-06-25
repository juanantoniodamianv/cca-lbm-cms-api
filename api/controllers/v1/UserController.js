/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');

module.exports = {
  _config: {
    model: 'user'
  },

  create: function (req, res) {
    if (req.body.password !== req.body.confirmPassword) {
      return ResponseService.json(401, res, "Password doesn't match")
    }

    var allowedParameters = [
      "email", "password"
    ]

    var data = _.pick(req.body, allowedParameters);

    User.create(data).then(function (user) {
      var responseData = {
        user: user,
        token: JwtService.issue({id: user.id})
      }
      return ResponseService.json(200, res, "User created successfully", responseData)
    }).catch(function (error) {
        if (error.invalidAttributes){
          return ResponseService.json(400, res, "User could not be created", error.Errors)
        }
      }
    )
  },

  index: function (req, res, next) {
    User.find(function foundUsers (err, users) {
      if (err) return next(err);
      var responseData = {
        users: users
      }
      return ResponseService.json(200, res, responseData)
    });
  },

  show: function (req, res, next) {
    User.findOne(req.params('id'), function foundUser (err, user) {
      if (err) return next(err);
      if (!user) return next();
      var responseData = {
        user: user
      }
      return ResponseService.json(200, res, responseData)
    });
  },

  // Render the edit view - not for api

  edit: function (req, res, next) {
    User.findOne(req.params('id'), function foundUser (err, user) {
      if (err) return next(err);
      if (!user) return next('User doesn\'t exist.');
      var responseData = {
        user: user
      }
      return ResponseService.json(200, res, responseData)
    });
  },

  update: function (req, res, next) {
    User.update(req.param('id'), req.params.all(), function userUpdated (err, user) {
      if (err) return ResponseService.json(400, res, "User could not be updated", error.Errors)
      var responseData = {
        user: user
      }
      return ResponseService.json(200, res, "User updated successfully", responseData)
    })
  }



};