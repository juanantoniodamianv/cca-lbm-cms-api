/**
 * MessageHistoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var _ = require('lodash');

module.exports = {
  _config: {
		model: 'messagehistory'
  }, 
  
  create: async (trigger) => {
    
    var data = {
      historyType,
      name,
      userId,
      message
    }
    await MessageHistory.create(data)
  },

};

