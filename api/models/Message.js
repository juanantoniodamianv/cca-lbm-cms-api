/**
 * Messages.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title: {
      type: "string",
      required: true,
      unique: true
    },
    message: {
      type: "string",
      required: true,
      maxLength: 250

    },
    deeplink: {
      type: "string",
    },
    locations: {
      collection: 'location',
      via: 'messages'
    }, 
    beaconsMessageOnTrigger: {
      collection: "beacon",
      via: "messageOnTrigger"
    },
    beaconsMessageAfterDelay: {
      collection: "beacon",
      via: "messageAfterDelay"
    },
    geofencesMessageOnTrigger: {
      collection: "geofence",
      via: "messageOnTrigger"
    },
    geofencesMessageAfterDelay: {
      collection: "geofence",
      via: "messageAfterDelay"
    }
  },

  customToJSON: function () {
    return this;
  }, 

  getTotalCount: async () => {
    var totalCount = await Message.count();
    if (totalCount) { totalCount = +totalCount; }
		return totalCount;
  },

};