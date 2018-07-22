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
  },

  customToJSON: function () {
    return this;
  }

};

