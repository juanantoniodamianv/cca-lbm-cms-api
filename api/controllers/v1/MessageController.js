/**
 * MessagesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var _ = require('lodash');

module.exports = {
	_config: {
		model: 'message'
	},  

	create: (req, res) => {
		if (!req.body.title || !req.body.message) return ResponseService.json(401, res, "Title and message attributes are required.");
		var allowedParameters = [
			"title", "message", "deeplink", "locations"
		]
		var data = _.pick(req.body, allowedParameters);

		Message.create(data)
			.then((message) => {
				var responseData = {
					message
				}

				message.locations.add(req.params('locations'));
				return ResponseService.json(200, res, "Message created succesfully.", responseData)
			})
			.catch( error => {
				if (error.invalidAttributes){
          return ResponseService.json(400, res, "Message could not be created", error.Errors)
        }
			})
	},

};

