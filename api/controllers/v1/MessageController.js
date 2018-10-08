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
		beforeDelete(req.param('id')).then(async (result) => { // This could be Lifecycle Callbacks, but don't pass path params. -.-
			if (result > 0) {
				return ResponseService.json(400, res, "This message is in use.");
			} else {
				await Message.destroy(req.param('id'), (err) => {
					if (err) return ResponseService.json(400, res, "Message could not be destroyed", err.Errors)
				})
				/* verificar metodo remover en cascada */
				destroyedMessage = await Message.removeFromCollection(req.param('id'), 'locations').members(req.body.locations)
					.intercept('UsageError', (err) => {
						return ResponseService.json(400, res, "LocationsMessages relationship could not be destroyed.", err)
					})
				var responseData = {
					message: destroyedMessage
				}
				return ResponseService.json(200, res, "Message destroyed succesfully", responseData)
			}
		})

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

	search: (req, res) => {
    var db = Message.getDatastore().manager;
		var value = new RegExp(req.param('value'));
		var messageIds = [];
		var options = {
			//limit: req.param('limit') || undefined,
			//skip: req.param('skip') || undefined,
			sort: req.param('sort') || 'createdAt desc' // columnName desc||asc
		};
        
    db.collection('message').find({
      $or: [
        {title: {$regex: value, $options: 'i'}}
      ]
    },{"_id":1})
    .toArray(async (err, messages) => {
      if (err) return ResponseService.json(400, res, "Messages could not be found: invalid data.", err)
			Object.keys(messages).forEach(key => {
				message = messages[key];
				messageIds.push(String(message['_id']));
			});

			var resultMessages = await Message.find({
				id: { in: messageIds }
			})
			.sort(options.sort)
			.populate('locations')
			.intercept('UsageError', (err) => {
				return ResponseService.json(400, res, "Messages with Locations could not be populated: invalid data", err)
			});
			var responseData = {
				messages: resultMessages
			}

			return ResponseService.json(200, res, responseData)

    });
  },

};

async function beforeDelete(messageId) {
	var countResult = 0;
	countResult = await Beacon.count({messageOnTrigger: messageId});
	if (countResult === 0) {
		countResult = await Beacon.count({messageAfterDelay: messageId});	
		if (countResult === 0) {
			countResult = await Geofence.count({messageOnTrigger: messageId});
			if (countResult === 0) {
				countResult = await Geofence.count({messageAfterDelay: messageId});
			}	
		}
	}
	return +countResult;
}

