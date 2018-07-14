
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

  'post /v1/forgot': 'v1/UserController.sendPasswordRecoveryEmail', // body: email 
  'post /v1/reset': 'v1/UserController.resetPassword', //body: password, confirmPassword  params: token

  /* Only test */
  'get /v1/alb_ping': 'TestController.isOk',
};
