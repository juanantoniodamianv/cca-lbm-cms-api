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
      notNull: true,
      unique: true
    },
    message: {
      type: "string",
      required: true,
      notNull: true,
      maxLength: 250

    },
    deeplink: {
      type: "string",

    },
    locations: {
      collection: 'location',
      via: 'messages',
      dominant: true      
    },
    toJSON: function () {
      var obj = this.toObject();
      return obj;
    }
  },

};

