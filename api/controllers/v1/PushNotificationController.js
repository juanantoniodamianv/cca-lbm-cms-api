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

  index: async(req, res) => {
    var totalCount;
    var responseData = {};
    var options = {
      limit: req.param('limit') || undefined,
      skip: req.param('skip') || undefined,
      sort: req.param('sort') || "createdAt desc" //columnName desc/asc
    };
    await MessageHistory.getTotalCount().then(count => {
      totalCount = count;
    })
    await MessageHistory.find({
      skip: options.skip,
      limit: options.limit,
      sort: options.sort
    }).intercept('UsageError', (err) => {
      return ResponseService.json(400, res, "Message History could not be found: invalid data.", err)
    }).then(messageHistory => {
      responseData = {
        messageHistory,
        skip: options.skip,
        limit: options.limit,
        total: totalCount || 0
      }
    })
    return responseData.total == 0 ? ResponseService.json(204, res, responseData) : ResponseService.json(200, res, responseData);
  },
  
};
