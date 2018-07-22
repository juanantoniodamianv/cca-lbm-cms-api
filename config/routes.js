
module.exports.routes = {
/*   'put /v1/user/login': 
  [ 
    function(req, res, next) {
      sails.log('Quick and dirty test:', req.allParams());
      return next();
    },
    {
      controller: 'v1/AuthController',
      action: 'login',
      csrf: false
    }
  ], */
  'put /v1/user/login': 'v1/AuthController.login',
  'post /v1/user/signup': 'v1/UserController.create',
  'get /v1/users': 'v1/UserController.index',
  'get /v1/user/:id': 'v1/UserController.show',
  'put /v1/user/:id': 'v1/UserController.update',
  'delete /v1/user/:id': 'v1/UserController.destroy',
  'get /v1/users/search': 'v1/UserController.search',
  'get /v1/me': 'v1/UserController.getMe',

  'post /v1/message': 'v1/MessageController.create',
  'get /v1/messages': 'v1/MessageController.index',
  'get /v1/message/:id': 'v1/MessageController.show',
  'put /v1/message/:id': 'v1/MessageController.update',
  'delete /v1/message/:id': 'v1/MessageController.destroy',

  'post /v1/location': 'v1/LocationController.create',
  'get /v1/locations': 'v1/LocationController.index',
  'get /v1/location/:id': 'v1/LocationController.show',
  'put /v1/location/:id': 'v1/LocationController.update',
  'delete /v1/location/:id': 'v1/LocationController.destroy',

  'post /v1/forgot': 'v1/UserController.sendPasswordRecoveryEmail', // body: email 
  'post /v1/reset': 'v1/UserController.resetPassword', //body: password, confirmPassword  params: token

  /* Only test */
  'get /v1/alb_ping': 'TestController.isOk',
};
