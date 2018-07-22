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
    },
    memberId: {
      type: "string",
      required: true,
      unique: true,
      columnType: 'string'
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
    messages: {
      collection: 'message',
      via: 'locations'
    }
  },

  customToJSON: function () {
    return this;
  }

};

