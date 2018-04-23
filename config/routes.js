
module.exports.routes = {
  'post /v1/user/login': 'v1/AuthController.login',
  'post /v1/user/signup': 'v1/UserController.create',
  'get /v1/users': 'v1/UserController.index',
  'get /v1/user/{id}': 'v1/UserController.show'
};
