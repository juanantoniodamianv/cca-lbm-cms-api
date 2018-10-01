/**
 * Geofence.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: "string",
      required: true
    },
    radius: {
      type: "number",
      required: true,
    },
    longitude: {
      type: "number",
      required: true,
    },
    latitude: {
      type: "number",
      required: true,
    },
    messageOnTrigger: {
      model: "message"
    },
    enableMessageOnTrigger: {
      type: "boolean",
      defaultsTo: true
    },
    messageAfterDelay: {
      model: "message"
    },
    enableMessageAfterDelay: {
      type: "boolean",
      defaultsTo: true
    },
    delayHours: {
      type: "number"
    },
    location: {
      model: 'location'
    }
  },

  customToJSON: function () {
    return this;
  },

  getTotalCount: async (locationId) => {
    if (locationId !== undefined) {
      var totalCount = await Geofence.count({where: {location: locationId}});
    } else {
      var totalCount = await Geofence.count();
    }
    if (totalCount) { totalCount = +totalCount; }
		return totalCount;
  },

  getById: async (id) => {
    var geofence = await Geofence.findOne(id)
    .populate('messageOnTrigger')
    .populate('messageAfterDelay');
    return geofence;
  },
};

