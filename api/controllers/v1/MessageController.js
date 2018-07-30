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
			"title", "message", "deeplink", "locations"
		]
		var data = _.pick(req.body, allowedParameters);

		var newMessage = await Message.create(data)
			.intercept('E_UNIQUE', (err) => {
				return ResponseService.json(400, res, "Message could not be created: title is already create.", err)
			})
			.intercept('UsageError', (err) =>{
				return ResponseService.json(400, res, "Message could not be created: invalid data.", err)				
			})
			.fetch();
/* 		if (req.body.locations) { 
			var locationsMessages = await Message.addToCollection(newMessage.id, 'locations', req.body.locations)	// [locationId, locationId]
																.intercept('UsageError', (err) => {
																	return ResponseService.json(400, res, "LocationsMessages relationship could not be created.", err)
																})
			newMessage = await Message.find(newMessage.id).populate('locations')
										.intercept('UsageError', (err) =>{
											return ResponseService.json(400, res, "Message with Locations could not be populated: invalid data.", err)				
										});
		} */
		var responseData = {
			message: newMessage,
		}
		return ResponseService.json(200, res, "Message created succesfully.", responseData)
	},

	update: async (req, res) => {
		await Message.update(req.param('id'), req.allParams())
			.intercept('UsageError', (err) =>{
				return ResponseService.json(400, res, "Message could not be created: invalid data.", err)				
			})
		await Message.replaceCollection(req.param('id'), 'locations', req.body.locations)
			.intercept('UsageError', (err) => {
				return ResponseService.json(400, res, "LocationsMessages relationship could not be created.", err)
			})
		updatedMessage = await Message.find(req.param('id')).populate('locations')
									.intercept('UsageError', (err) =>{
										return ResponseService.json(400, res, "Message with Locations could not be populated: invalid data.", err)				
									});
		var responseData = {
			message: updatedMessage
		}
		return ResponseService.json(200, res, "Message updated succesfully", responseData)
	},

	destroy: async (req, res) => {
		await Message.destroy(req.param('id'), (err) => {
			if (err) return ResponseService.json(400, res, "Message could not be destroyed", err.Errors)
		})
		/* verificar metodo remover en cascada */
		destroyedMessage = await Message.removeFromCollection(req.param('id'), 'locations', req.param('locations'))
			.intercept('UsageError', (err) => {
				return ResponseService.json(400, res, "LocationsMessages relationship could not be destroyed.", err)
			})
		var responseData = {
			message: destroyedMessage
		}
		return ResponseService.json(200, res, "Message destroyed succesfully", responseData)
	},

	index: async (req, res, next) => {
		var totalCount;
		Message.getTotalCount().then(count => { totalCount = count })
		var options = {
			limit: req.param('limit') || undefined,
			skip: req.param('skip') || undefined,
			sort: req.param('sort') || 'createdAt desc' // columnName desc||asc
		};
		var messages = await Message.find({
										skip: options.skip,
										limit: options.limit,
										sort: options.sort,
									}).populate('locations')
										.intercept('UsageError', (err) => {
											return ResponseService.json(400, res, "Message with Locations could not be populated: invalid data.", err)				
										});
		var responseData = {
			messages,
			skip: options.skip,
			limit: options.limit,
			total: totalCount || 0
		}
		if (responseData.total === 0) return ResponseService.json(204, res, responseData)
		return ResponseService.json(200, res, responseData)
	},

	show: async (req, res, next) => {
		var message = await Message.find(req.param('id')).populate('locations')
										.intercept('UsageError', (err) =>{
											return ResponseService.json(400, res, "Message with Locations could not be populated: invalid data.", err)				
										});
		var responseData = {
			message
		}
		if (message.length <= 0) return ResponseService.json(204, res, responseData)
		return ResponseService.json(200, res, responseData)
	},

};

