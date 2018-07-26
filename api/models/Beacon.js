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
  
  getTotalCount: async () => {
    var totalCount = await Beacon.count();
    if (totalCount) { totalCount = +totalCount; }
		return totalCount;
	},
};

