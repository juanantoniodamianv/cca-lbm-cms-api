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
  
  index: async (req, res, next) => {
		var options = {
			limit: req.param('limit') || undefined,
			skip: req.param('skip') || undefined,
			sort: req.param('sort') || 'createdAt desc' // columnName desc||asc
    };
    var locations = await Location.find(options).populate('messages')
      .intercept('UsageError', (err) => {
        return ResponseService.json(400, res, "Locations with Messages could not be populated: invalid data.", err)
      });
    var responseData = {
      locations,
      skip: options.skip,
			limit: options.limit,
			total: locations.length
    }
    return ResponseService.json(200, res, responseData)
  },
  
  show: async (req, res, next) => {
    var location = await Location.find(req.param('id')).populate('messages')
                    .intercept('UsageError', (err) =>{
                      return ResponseService.json(400, res, "Message with Locations could not be populated: invalid data.", err)				
                    });
    var responseData = {
      location
    }
    if (location.length <= 0) return ResponseService.json(204, res, responseData)
    return ResponseService.json(200, res, responseData)
  },
  
  getAllLocationMessages: async (req, res) => {
    if (!req.param('locationid')) return ResponseService.json(401, res, "LocationId path param are required.");
    var location = await Location.find({
      where: { id: req.param('locationid') }
    }).populate('messages')
    .intercept('UsageError', (err) => {
      return ResponseService.json(400, res, "Messages with Locations could not be populated: invalid data.", err)
    });
    var responseData = {
      location,
    }
    if (location.length <= 0) return ResponseService.json(204, res, responseData)
    return ResponseService.json(200, res, responseData)
  },

};

