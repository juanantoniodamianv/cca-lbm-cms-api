
module.exports.routes = {
  'post /user/login': 'AuthController.login',
  'post /user/signup': 'UserController.create',
  'get /users': 'UserController.index',
  'get /user/{id}': 'UserController.show'
};
