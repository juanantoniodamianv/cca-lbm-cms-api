/**
 * MessageHistory.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
var moment = require('moment');

module.exports = {

  attributes: {
    historyType: {
      type: "string",
    },
    name: {
      type: "string",
    },
    userId: {
      type: "string"
    },
    message: {
      type: "string"
    },

    // Relationships
    location: {
      model: "location"
    },
  },

  // I need locationId to association with trigger message?
  createMessageHistory: async (deviceId, trigger, triggerType) => {
    var data = {
      location: trigger.location, // <-- locationId to beacon or geofence with association, neccessary to index function
      historyType: triggerType,
      name: trigger.name,
      userId: deviceId,
      message: trigger.messageOnTrigger.message
    }
    sails.log.info(data);
    await MessageHistory.create(data)
      .intercept('UsageError', (err) => {
        return sails.log.error(`Error ocurred: ${err}`)
      })
    sails.log.info(`Message History has been saved successfully.`)
    return 0; 
  },

  getTotalCount: async () => {
    var totalCount = await MessageHistory.count();
    if (totalCount) { totalCount = +totalCount; }
		return totalCount;
  },
  
  isAvailableToPushNotification: async (deviceId, triggerType, body) => {  // --> inputs: {deviceId as userId, triggerType as historyType, body as message}
    var expiresAt = 2;  // Value to expire message on push notification, after this data value the notification has been available to sent
    //sails.log(`Inputs: ${deviceId}, ${triggerType}, ${body}`);
    var result = await MessageHistory.find({
      userId: deviceId,
      historyType: triggerType,
      message: body
    }).limit(1);

    if (result == undefined) return true;
    sails.log.info(`****createdAt:**** ${result}`);

    
    let date = moment(result.createdAt);
    date = date.add(expiresAt, 'minutes');
    if (moment() > date) {
      return true
    } else {
      return false
    }
  },

};

