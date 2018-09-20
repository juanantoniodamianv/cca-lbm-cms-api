
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
  'get /v1/messages/search': 'v1/MessageController.search',

  /* Locations */
  'post /v1/location': 'v1/LocationController.create',
  'get /v1/locations': 'v1/LocationController.index',
  'get /v1/location/:id': 'v1/LocationController.show',
  'put /v1/location/:id': 'v1/LocationController.update',
  'delete /v1/location/:id': 'v1/LocationController.destroy',
  'get /v1/locations/search': 'v1/LocationController.search',


  /* Location Messages */
  'get /v1/location/:locationid/messages': 'v1/LocationController.getAllLocationMessages',           // <-- Get all messages associated to a specific location
  'get /v1/location/:locationid/messages/search': 'v1/LocationController.searchAllLocationMessages',  // <-- Search messages with association to a specific location
  'get /v1/location/:locationid/notifications': 'v1/LocationController.getAllLocationNotifications', // <-- Get all notifications sent for a specific locations




  /* #### Location Geofences ####*/
  'post /v1/location/:locationid/geofence': 'v1/GeofenceController.create',                   // <-- Create a new geofence for a specific location
  
  'get /v1/location/:locationid/geofence/:geofenceid': 'v1/GeofenceController.show',          // <-- Get geofence information for a specific geofence
  'put /v1/location/:locationid/geofence/:geofenceid': 'v1/GeofenceController.update',        // <-- Update geofence information for a specific geofence
  'delete /v1/location/:locationid/geofence/:geofenceid': 'v1/GeofenceController.destroy',    // <-- Delete geofence 

  'get /v1/locations/geofences': 'v1/GeofenceController.index',                               // <-- Retrieve all geofences with their locations.
  'get /v1/locations/:locationid/geofences': 'v1/GeofenceController.index',                    // <-- Get all geofences for a specific location

  'get /v1/locations/:locationid/geofences/:geofenceid/messages': 'v1/GeofenceController.getAllGeofenceMessages', // <-- Get all messages associated to a specific geofence
  'post /v1/locations/:locationid/geofences/:geofenceid/messages': 'v1/GeofenceController.postGeofenceMessage',   // <-- Associate message to a specific geofence
  'put /v1/locations/:locationid/geofences/:geofenceid/messages': 'v1/GeofenceController.updateGeofenceMessage',   // <-- Update message associated to a specific geofence
  'delete /v1/locations/:locationid/geofences/:geofenceid/messages': 'v1/GeofenceController.deleteGeofenceMessage',   // <-- Delete message associated to a specific geofence

  /* #### Location Beacons ####*/
  'post /v1/location/:locationid/beacon': 'v1/BeaconController.create',                   // <-- Create a new beacon for a specific location
    
  'get /v1/location/:locationid/beacon/:beaconid': 'v1/BeaconController.show',          // <-- Get beacon information for a specific beacon
  'put /v1/location/:locationid/beacon/:beaconid': 'v1/BeaconController.update',        // <-- Update beacon information for a specific beacon
  'delete /v1/location/:locationid/beacon/:beaconid': 'v1/BeaconController.destroy',    // <-- Delete beacon 

  'get /v1/locations/beacons': 'v1/BeaconController.index',                               // <-- Retrieve all beacons with their locations.
  'get /v1/locations/:locationid/beacons': 'v1/BeaconController.index',                    // <-- Get all beacons for a specific location.

  /* ONLY FOR APP */
  //'get /v1/locations/location-number/:locationNumber/beacons': 'v1/BeaconController.indexPerLocationNumber',
  //'get /v1/locations/location-number/:locationNumber/geofences': 'v1/GeofenceController.indexPerLocationNumber',
  'get /v1/locations/location-number/:locationNumber': 'v1/BeaconController.indexPerLocationNumber',

  'get /v1/locations/:locationid/beacons/:beaconid/messages': 'v1/BeaconController.getAllBeaconMessages', // <-- Get all messages associated to a specific beacon
  'post /v1/locations/:locationid/beacons/:beaconid/messages': 'v1/BeaconController.postBeaconMessage',   // <-- Associate message to a specific beacon
  'put /v1/locations/:locationid/beacons/:beaconid/messages': 'v1/BeaconController.updateBeaconMessage',   // <-- Update message associated to a specific beacon
  'delete /v1/locations/:locationid/beacons/:beaconid/messages': 'v1/BeaconController.deleteBeaconMessage',   // <-- Delete message associated to a specific beacon
  
  /* 'post /v1/devices': '',
  'delete /v1/devices': '',*/
  
  // Params: beaconId/geofenceId, deviceId
  'post /v1/notifications': 'v1/PushNotificationController.triggerPushNotification', //  <-- Called when device has entered a specified Geofence or found a beacon. 
  'get /v1/notifications': 'v1/PushNotificationController.index',  //  <-- Get a list of all notifications sent

  /* Only test */
  'get /v1/alb_ping': 'TestController.isOk',
};
