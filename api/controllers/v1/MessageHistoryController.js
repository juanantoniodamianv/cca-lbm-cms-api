/**
 * MessageHistoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var _ = require('lodash');
var converter = require('json-2-csv');

module.exports = {
  _config: {
		model: 'messagehistory'
  }, 
  
  exportToCsv: async (req, res) => {
    var location = req.param('locationid');

    await MessageHistory.find({
      where: { location }
    })
    .intercept('UsageError', (err) => {
      return ResponseService.json(400, res, "Message History could not be found: invalid data.", err)
    })
    .then(messageHistory => {
      var options = {
        delimiter : {
          wrap  : '"', // Double Quote (") character
          field : ',', // Comma field delimiter
          array : ';', // Semicolon array value delimiter
          eol   : ' ' // Newline delimiter
        },
        prependHeader    : true,
        sortHeader       : false,
        trimHeaderValues : true,
        trimFieldValues  :  true,
      };
      
      res.setHeader('Content-disposition', 'attachment; filename="report.csv"');
      res.set('Content-Type', 'text/csv');
      
      
      var json2csvCallback = (err, csv) => {
        if (err) throw err;
        return res.status(200).send(csv);
      }
      converter.json2csv(messageHistory, json2csvCallback, options);
     
    })
  }

};

