module.exports = {
  triggerPushNotification: async (req, res) => {
    // deviceId, beaconId/geofenceId
    var deviceId = req.body.deviceId;
    var triggerType = req.body.triggerType; // beaconId || geofenceId
    var triggerId = req.body.triggerId; 
    var title;
    var body;
    // Find beaconId || geofenceId, with triggerId
    if (triggerType === 'beacon') {
      await Beacon.getById(triggerId).then(beacon => {
        if (beacon !== undefined && beacon.messageOnTrigger) {
          title = beacon.name;
          body = beacon.messageOnTrigger.message;
          MessageHistory.createMessageHistory(deviceId, beacon, triggerType);
        } else {
          // not exist beacon or not have a message to send
          return res.json('Error, beacon problem.');
        }
      })
    } else if (triggerType === 'geofence') {
      await Geofence.getById(triggerId).then(geofence => {
        if (geofence !== undefined && geofence.messageOnTrigger) {
          title = geofence.name;
          body = geofence.messageOnTrigger.message;
          MessageHistory.createMessageHistory(deviceId, geofence, triggerType);
        } else {
          // not exist geofence or not have a message to send
          return res.json('Error, geofence problem.');
        }
      })
    }
    if (title !== undefined && body !== undefined) {
      await FirebaseCloudMessage.sendPushNotification({deviceId, title, body})
    }
    return res.json('ok'); 
  },
  
};
