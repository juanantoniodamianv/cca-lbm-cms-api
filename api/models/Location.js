/**
 * Location.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: "string",
      required: true,
      unique: true,
      columnType: 'string'
    },
    contactEmail: {
      type: "string",
      required: true,
    },
    locationNumber: {
      type: "number",
      required: true,
      unique: true,
      columnType: 'number'
    },
    memberId: {
      type: "string",
      required: true
    },
    address1: {
      type: "string"
    },
    address2: {
      type: "string"
    },
    city: {
      type: "string"
    },
    state: {
      type: "string"
    },
    postalCode: {
      type: "number"
    },
    active: {
      type: "boolean",
      defaultsTo: true
    },

    // Relationships

    messages: {
      collection: 'message',
      via: 'locations',
    },
    geofences: {
      collection: 'geofence',
      via: 'location'
    },
    beacons: {
      collection: 'beacon',
      via: 'location'
    },
    messageHistory: {
      collection: 'messageHistory',
      via: 'location'
    }
  },

  customToJSON: function () {
    return this;
  },  

  getLocation: async (id) => {
    var location = await Location.find(id);
    return location;
  },

  isRelationship: async (message, location) => {
    var messageLocation = await Location.find({id: location})
                            .populate('messages', {
                              where: {
                                id: message
                              },
                              limit: 1
                            });
    sails.log.info(`MessageLocation: ${messageLocation}`);
    return messageLocation;
  },

  getTotalCount: async () => {
    var totalCount = await Location.count();
    if (totalCount) { totalCount = +totalCount; }
		return totalCount;
  },
  
};

