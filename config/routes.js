
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
  /* Users */
  'put /v1/user/login': 'v1/AuthController.login',
  'post /v1/user/signup': 'v1/UserController.create',
  'get /v1/users': 'v1/UserController.index',
  'get /v1/user/:id': 'v1/UserController.show',
  'put /v1/user/:id': 'v1/UserController.update',
  'delete /v1/user/:id': 'v1/UserController.destroy',
  'get /v1/users/search': 'v1/UserController.search',
  'get /v1/me': 'v1/UserController.getMe',

  /* Users Account */
  'post /v1/forgot': 'v1/UserController.sendPasswordRecoveryEmail', // body: email 
  'post /v1/reset': 'v1/UserController.resetPassword', //body: password, confirmPassword  params: token

  /* Messages */
  'post /v1/message': 'v1/MessageController.create',
  'get /v1/messages': 'v1/MessageController.index',
  'get /v1/message/:id': 'v1/MessageController.show',
  'put /v1/message/:id': 'v1/MessageController.update',
  'delete /v1/message/:id': 'v1/MessageController.destroy',

  /* Locations */
  'post /v1/location': 'v1/LocationController.create',
  'get /v1/locations': 'v1/LocationController.index',
  'get /v1/location/:id': 'v1/LocationController.show',
  'put /v1/location/:id': 'v1/LocationController.update',
  'delete /v1/location/:id': 'v1/LocationController.destroy',

  /* Location Geofences */
  'post /v1/location/geofence': 'v1/GeofenceController.create',
  'get /v1/location/:locationid/geofences': 'v1/GeofenceController.index',
  'get /v1/locations/geofences': 'v1/GeofenceController.index', // <-- Retrieve all geofences with their locations.
  'get /v1/location/:location-id/geofence/:geofence-id': 'v1/GeofenceController.show',
  'put /v1/location/:location-id/geofence/:geofence-id': 'v1/GeofenceController.update',
  'delete /v1/location/:location-id/geofence/:geofence-id': 'v1/GeofenceController.destroy',

  /* Location Beacons */
  'post /v1/location/beacon': 'v1/BeaconController.create',
  'get /v1/location/:location-id/beacons': 'v1/BeaconController.index',
  'get /v1/location/:location-id/beacon/:beacon-id': 'v1/BeaconController.show',
  'put /v1/location/:location-id/beacon/:beacon-id': 'v1/BeaconController.update',
  'delete /v1/location/:location-id/beacon/:beacon-id': 'v1/BeaconController.destroy',

  /* Location Messages */

  /* Only test */
  'get /v1/alb_ping': 'TestController.isOk',
};
