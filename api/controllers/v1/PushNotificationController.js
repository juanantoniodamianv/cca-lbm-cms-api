const cron = require('node-schedule');

module.exports = {
  triggerPushNotification: async (req, res) => {
    var deviceId = req.body.deviceId;
    var triggerType = req.body.triggerType; // string: "beacon" || "geofence"
    var triggerId = req.body.triggerId;     // string: beaconId || geofenceId
    var trigger;                            // object: beaconId || geofenceId
    var title;
    var body;
    var messageAfterDelay;
    var delayHours;
    var isAvailable;
    /* FIND BEACON OR GEOFENCE, WITH triggerId */
    if (triggerType === 'beacon') {
      await Beacon.getById(triggerId).then(beacon => {
        if (beacon !== undefined && beacon.messageOnTrigger) {
          title = beacon.name;
          body = beacon.messageOnTrigger.message;
          url = beacon.messageOnTrigger.deeplink;
          trigger = beacon;
        } else {
          /* NOT EXIST BEACON OR NOT HAVE A MESSAGE TO SEND */
          //return res.json('Error, beacon problem.');
          res.json(404, { error: "Not exist beacon or not have a message to send." })
        }
      })
    } else if (triggerType === 'geofence') {
      await Geofence.getById(triggerId).then(geofence => {
        if (geofence !== undefined && geofence.messageOnTrigger) {
          title = geofence.name;
          body = geofence.messageOnTrigger.message;
          url = geofence.messageOnTrigger.deeplink;
          trigger = geofence;
        } else {
          /* NOT EXIST GEOFENCE OR NOT HAVE A MESSAGE TO SEND */
          res.json(404, { error: "Not exist geofence or not have a message to send." })
        }
      })
    }
    /* Device is available to receive push notification? */
    await MessageHistory.isAvailableToPushNotification(deviceId, triggerType, body).then(result => {
      isAvailable = result;  
    });
    sails.log.info(isAvailable)
    if (!isAvailable) return res.json(404, { error: "This message has already been sent a moment ago." });
    /* SENT MESSAGE ON TRIGGER */
    if (title !== undefined && body !== undefined && deviceId !== undefined && trigger !== undefined && triggerType !== undefined) {
      sails.log.info('Sending Message')
      MessageHistory.createMessageHistory(deviceId, trigger, triggerType);
      await FirebaseCloudMessage.sendPushNotification({deviceId, title, body, url})
    }
    /* SENT MESSAGE AFTER DELAY (IF EXISTS) */
    if ((trigger.messageAfterDelay !== null && trigger.messageAfterDelay.message != '') && trigger.enableMessageAfterDelay) {
      messageAfterDelay = trigger.messageAfterDelay.message;
      delayHours = trigger.delayHours || 0;
      delayPushNotification(deviceId, trigger, triggerType, title, messageAfterDelay, url, delayHours);
    }
    return res.json('ok'); 
  },

  index: async(req, res) => {
    var totalCount;
    var responseData = {};
    var options = {
      limit: req.param('limit') || undefined,
      skip: req.param('skip') || undefined,
      sort: req.param('sort') || "createdAt desc", //columnName desc/asc
    };
    var location = req.param('locationid') || undefined;
    if (location) {
      await MessageHistory.find({
        where: { location },
        skip: options.skip,
        limit: options.limit,
        sort: options.sort
      })
      .intercept('UsageError', (err) => {
        return ResponseService.json(400, res, "Message History could not be found: invalid data.", err)
      }).then(messageHistory => {
        responseData = {
          messageHistory,
          skip: options.skip,
          limit: options.limit,
        }
      })
    } else {
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
    }
    return responseData.total == 0 ? ResponseService.json(204, res, responseData) : ResponseService.json(200, res, responseData);
  },
  
};

function delayPushNotification (deviceId, trigger, triggerType, title, body, url, delayHours) {
  var date = new Date();
  date.setHours(date.getHours()+delayHours);
  cron.scheduleJob(date, async () => {
    await MessageHistory.createMessageHistory(deviceId, trigger, triggerType);
    await FirebaseCloudMessage.sendPushNotification({deviceId, title, body, url});
  });      
}