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
  createMessageHistory: async (deviceId, trigger, triggerType, message) => {
    triggerType = triggerType.toLowerCase() == 'beacon' ? trigger.beaconType : 'geofence';
    var data = {
      location: trigger.location, // <-- locationId to beacon or geofence with association, neccessary to index function
      historyType: triggerType,
      name: trigger.name,
      userId: deviceId,
      message: message
    }
    sails.log.info(data);
    await MessageHistory.create(data)
      .intercept('UsageError', (err) => {
        return sails.log.error(`Error ocurred: ${err}`)
      })
    sails.log.info(`Message History has been saved successfully.`)
    return 0; 
  },

  getTotalCount: async (id) => {
    if (id !== undefined) {
      var totalCount = await MessageHistory.count({location: id});
    } else {
      var totalCount = await MessageHistory.count();
    }
    if (totalCount) { totalCount = +totalCount; }
		return totalCount;
  },
  
  isAvailableToPushNotification: async (deviceId, triggerType, body) => {  
    var expiresAt = 12;  // Value to expire message on push notification, after this data value the notification has been available to sent
    var expiresTime = 'hours';  /*  --> 'hours' 'minutes' or 'seconds' */
    var query = await MessageHistory.find({
      where: {
        userId: deviceId,
        historyType: triggerType,
        message: body
      },
      select: ['createdAt'],
      sort: ['createdAt DESC'],
      limit: 1
    });
    if (query == undefined || query.length == 0) return true;
    
    let date = moment(query[0].createdAt);
    sails.log.info(`****createdAt:**** ${date}`);
    date = date.add(expiresAt, expiresTime);
    sails.log.info(`****expiresAt:**** ${date}`);
    sails.log.info(`****Now:**** ${moment()}`);
    sails.log.info(moment() > date);
    return moment() > date;

  },

};

