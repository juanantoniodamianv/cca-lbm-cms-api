/**
 * LocationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var _ = require('lodash');

module.exports = {
  _config: {
    model: 'location'
  },

  create: async (req, res) => {
    if (!req.body.name || !req.body.contactEmail || !req.body.locationNumber || !req.body.memberId) return ResponseService.json(401, res, "Name, Contact Email, Location Number and Member Id are required.");
    var allowedParameters = [
      "name", "contactEmail", "locationNumber", "memberId", "address1", "address2", "city", "state", "postalCode", "active"
    ]
    var data = _.pick(req.body, allowedParameters);
    var newLocation = await Location.create(data)
      .intercept('E_UNIQUE', (err) => {
        return ResponseService.json(400, res, "Location could not be created: name or memberId is already create.", err)
      })
      .intercept('UsageError', (err) => {
        return ResponseService.json(400, res, "Location could not be created: invalid data.", err)
      })
      .fetch();
      var responseData = {
        location: newLocation
      }
      return ResponseService.json(200, res, "Location created succesfully", responseData)
  },  

  update: (req, res) => {
    Location.update(req.param('id'), req.allParams(), (err, location) => {
      if (err) return ResponseService.json(400, res, "Location could not be updated", err.Errors)
      var responseData = {
        location
      }
      return ResponseService.json(200, res, "Location updated succesfully", responseData)
    })
  },

  destroy: (req, res) => {
		Location.destroy(req.param('id'), (err, location) => {
			if (err) return ResponseService.json(400, res, "Location could not be destroyed", err.Errors)
			var responseData = {
				location
			}
			return ResponseService.json(200, res, "Location destroyed succesfully", responseData)
		})
  },
  
  index: (req, res, next) => {
		var options = {
			limit: req.param('limit') || undefined,
			skip: req.param('skip') || undefined,
			sort: req.param('sort') || 'createdAt desc' // columnName desc||asc
		};
		Location.find(options, (err, locations) => {
			if (err) return next(err);
			var responseData = {
				locations,
				skip: options.skip,
				limit: options.limit,
				total: messages.length
			}
			return ResponseService.json(200, res, responseData)
		});
  },
  
  show: (req, res, next) => {
		Location.findOne(req.param('id'), (err, location) => {
			if (err) return next(err);
			if (!location) return next();
			var responseData = {
				location
			}
			return ResponseService.json(200, res, responseData)
		});
	},



};

