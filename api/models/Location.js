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
      unique: true
    },
    contactEmail: {
      type: "email",
      required: true,
    },
    locationNumber: {
      type: "integer",
      required: true,
    },
    memberId: {
      type: "string",
      required: true,
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
      type: "integer"
    },
    active: {
      type: "boolean",
      defaultsTo: true
    },
    toJSON: () => {
      var obj = this.toObject();
      return obj;
    }
  },

};

