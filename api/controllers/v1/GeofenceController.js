/**
 * GeofenceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var _ = require('lodash');

module.exports = {
  _config: {
    model: 'geofence'
  },

  create: async (req, res) => {
    if (!req.body.name || !req.body.radius || !req.body.longitude || !req.body.latitude || !req.body.location) return ResponseService.json(401, res, "Name, Radius, Longitude, Latitude and Location attributes are required.");
    
    /* Verify if the Location parameter exists */
    if (Location.getLocation(req.body.location) === undefined) return ResponseService.json(400, res, "The specified location does not exist.", err)
    if (req.body.messageOnTrigger && (Location.isRelationship(req.body.messageOnTrigger, req.body.location)) === undefined) return ResponseService.json(400, res, "Relationship with messageOnTrigger does not exist.")
    if (req.body.messageAfterDelay && (Location.isRelationship(req.body.messageAfterDelay, req.body.location)) === undefined) return ResponseService.json(400, res, "Relationship with messageAfterDelay does not exist.")

    var allowedParameters = [
      "name", "radius", "longitude", "latitude", "messageOnTrigger", "enableMessageOnTrigger", "messageAfterDelay", "enableMessageAfterDelay", "delayHours", "location"
    ]
    var data = _.pick(req.body, allowedParameters);
    var newGeofence = await Geofence.create(data)
      .intercept('E_UNIQUE', (err) => {
        return ResponseService.json(400, res, "Geofence could not be created: name is already create.", err)
      })
      .intercept('UsageError', (err) => {
        return ResponseService.json(400, res, "Geofence could not be created: invalid data.", err)
      })
      .fetch();
      var responseData = {
        geofence: newGeofence
      }
      return ResponseService.json(200, res, "Geofence created succesfully.", responseData)
  },

  update: (req, res) => {
    if (req.body.messageOnTrigger && (Location.isRelationship(req.body.messageOnTrigger, req.param('location-id'))) === undefined) return ResponseService.json(400, res, "Relationship with messageOnTrigger does not exist.")
    if (req.body.messageAfterDelay && (Location.isRelationship(req.body.messageAfterDelay, req.param('location-id'))) === undefined) return ResponseService.json(400, res, "Relationship with messageAfterDelay does not exist.")
    
    var allowedParameters = [
      "name", "radius", "longitude", "latitude", "messageOnTrigger", "enableMessageOnTrigger", "messageAfterDelay", "enableMessageAfterDelay", "delayHours"
    ]
    var data = _.pick(req.body, allowedParameters);

    Geofence.update(req.param('geofence-id'), data, (err, geofence) => {
      if (err) return ResponseService.json(400, res, "Geofence could not be updated", err.Errors)
      var responseData = {
        geofence
      }
      return ResponseService.json(200, res, "Geofence updated succesfully", responseData)
    })
  },

  destroy: (req, res) => {
    Geofence.destroy(req.param('geofence-id'), (err, geofence) => {
      if (err) return ResponseService.json(400, res, "Geofence could not be destroyed", err.Errors)
      var responseData = {
        geofence
      }
      return ResponseService.json(200, res, "Geofence destroyed succesfully", responseData)
    })
  },
  
  index: async (req, res) => {
    /* var totalCount;
		Geofence.getTotalCount().then(count => { totalCount = count }) */
    var options = {
			limit: req.param('limit') || undefined,
			skip: req.param('skip') || undefined,
			sort: req.param('sort') || 'createdAt desc' // columnName desc||asc
    };
    if (req.param('locationid') !== undefined) {
      var geofences = await Location.find({
        where: { id: req.param('locationid') },
        skip: options.skip,
        limit: options.limit,
        sort: options.sort
      }).populate('geofences')
    } else {
      var geofences = await Geofence.find(options).populate('location')
        .intercept('UsageError', (err) => {
          return ResponseService.json(400, res, "Geofence with Locations could not be populated: invalid data.", err)
        });
    }
    var responseData = {
      location: geofences,
      skip: options.skip,
			limit: options.limit,
			//total: totalCount || 0
    }
    if (responseData.total === 0) return ResponseService.json(204, res, responseData)
    return ResponseService.json(200, res, responseData)
  },
  
  show: async (req, res) => {
    var geofence = await Geofence.find(req.param('geofence-id')).populate('locations')
      intercept('UsageError', (err) => {
        return ResponseService.json(400, res, "Geofence with Locations could not be populated: invalid data", err)
      });
    var responseData = {
      geofence
    }
    if (geofence.length <= 0) return ResponseService.json(204, res, responseData)
    return ResponseService.json(200, res, responseData)
  },

};


