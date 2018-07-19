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

	create: async (req, res) => {
		if (!req.body.title || !req.body.message) return ResponseService.json(401, res, "Title and message attributes are required.");
		var allowedParameters = [
			//"title", "message", "deeplink", "locations"
			"title", "message", "deeplink"
		]
		var data = _.pick(req.body, allowedParameters);
		sails.log.info("Entré");

		var newMessage = await Message.create(data)
			.intercept('E_UNIQUE', (err) => {
				return ResponseService.json(400, res, "Message could not be created: title is already create.", err)
			})
			.intercept('UsageError', (err) =>{
				return ResponseService.json(400, res, "Message could not be created: invalid data.", err)				
			})
			.fetch();
			sails.log(newMessage);
			var responseData = {
				message: newMessage
			}
			return ResponseService.json(200, res, "Message created succesfully.", responseData)

		/* Message.create(data)
			.then((message) => {
				var responseData = {
					message
				}

				//message.locations.add(req.params('locations'));
				return ResponseService.json(200, res, "Message created succesfully.", responseData)
			})
			.catch( error => {
				if (error.invalidAttributes){
          return ResponseService.json(400, res, "Message could not be created", error.Errors)
        }
			}) */
	},

	update: (req, res) => {
		Message.update(req.param('id'), req.allParams(), (err, message) => {
			if (err) return ResponseService.json(400, res, "Message could not be updated", error.Errors)
			var responseData = {
				message
			}
			return ResponseService.json(200, res, "Message updated succesfully", responseData)
		})
	},

	destroy: (req, res) => {
		Message.destroy(req.param('id'), (err, message) => {
			if (err) return ResponseService.json(400, res, "Message could not be destroyed", err.Errors)
			var responseData = {
				message
			}
			return ResponseService.json(200, res, "Message destroyed succesfully", responseData)
		})
	},

	index: (req, res, next) => {
		var options = {
			limit: req.param('limit') || undefined,
			skip: req.param('skip') || undefined,
			sort: req.param('sort') || 'createdAt desc' // columnName desc||asc
		};
		Message.find(options, (err, messages) => {
			if (err) return next(err);
			var responseData = {
				messages,
				skip: options.skip,
				limit: options.limit,
				total: messages.length
			}
			return ResponseService.json(200, res, responseData)
		});
	},

	show: (req, res, next) => {
		Message.findOne(req.param('id'), (err, message) => {
			if (err) return next(err);
			if (!message) return next();
			var responseData = {
				message
			}
			return ResponseService.json(200, res, responseData)
		});
	},

	

};

