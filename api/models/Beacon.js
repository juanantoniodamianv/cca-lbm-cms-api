/**
 * Beacon.js
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
      columnType: "string"
    },
    beaconType: {
      type: "string"
    },  
    majorId: {
      type: "number",
      required: true,
    },
    minorId: {
      type: "number",
      required: true,
    },
    triggerProximity: {
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
      type: "number",
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
      var totalCount = await Beacon.count({where: {location: locationId}});
    } else {
      var totalCount = await Beacon.count();
    }
    if (totalCount) { totalCount = +totalCount; }
		return totalCount;
  },
  
  getById: async (id) => {
    var beacon = await Beacon.findOne(id).populate('messageOnTrigger');
    return beacon;
  },
};

