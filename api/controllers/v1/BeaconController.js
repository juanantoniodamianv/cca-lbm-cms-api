/**
 * BeaconController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var _ = require('lodash');

module.exports = {
  _config: {
    model: 'beacon'
  },
  
  create: async (req, res) => {
    if (!req.body.name || !req.body.majorId || req.body.minorId || req.body.triggerProximity || !req.body.location) return ResponseService.json(401, res, "Name, MajorId, MinorId and TriggerProximity attributes are required.");

    /* Verify if the Beacon parameter exists */
    if (Location.getLocation(req.body.location) === undefined) return ResponseService.json(400, res, "The specified location does not exist.", err)
    if (req.body.messageOnTrigger && (Location.isRelationship(req.body.messageOnTrigger, req.body.location)) === undefined) return ResponseService.json(400, res, "Relationship with messageOnTrigger does not exist.")
    if (req.body.messageAfterDelay && (Location.isRelationship(req.body.messageAfterDelay, req.body.location)) === undefined) return ResponseService.json(400, res, "Relationship with messageAfterDelay does not exist.")

    var allowedParameters = [
      "name", "beaconType", "majorId", "minorId", "triggerProximity", "messageOnTrigger", "enableMessageOnTrigger", "messageAfterDelay", "enableMessageAfterDelay", "delayHours", "location"
    ]
    var data = _.pick(req.body, allowedParameters);
    var newBeacon = await Beacon.create(data)
      .intercept('E_UNIQUE', (err) => {
        return ResponseService.json(400, res, "Beacon could not be created: name is already create.", err)
      })
      .intercept('UsageError', (err) => {
        return ResponseService.json(400, res, "Beacon could not be created: invalid data.", err)
      })
      .fetch();
      var responseData = {
        beacon: newBeacon
      }
      return ResponseService.json(200, res, "Beacon created succesfully.", responseData)
  },

  update: (req, res) => {
    if (req.body.messageOnTrigger && (Location.isRelationship(req.body.messageOnTrigger, req.param('location-id'))) === undefined) return ResponseService.json(400, res, "Relationship with messageOnTrigger does not exist.")
    if (req.body.messageAfterDelay && (Location.isRelationship(req.body.messageAfterDelay, req.param('location-id'))) === undefined) return ResponseService.json(400, res, "Relationship with messageAfterDelay does not exist.")
    
    var allowedParameters = [
      "name", "beaconType", "majorId", "minorId", "triggerProximity", "messageOnTrigger", "enableMessageOnTrigger", "messageAfterDelay", "enableMessageAfterDelay", "delayHours"
    ]
    var data = _.pick(req.body, allowedParameters);

    Beacon.update(req.param('beacon-id'), data, (err, beacon) => {
      if (err) return ResponseService.json(400, res, "Beacon could not be updated", err.Errors)
      var responseData = {
        beacon
      }
      return ResponseService.json(200, res, "Beacon updated succesfully", responseData)
    })
  },

  destroy: (req, res) => {
    Beacon.destroy(req.param('beacon-id'), (err, beacon) => {
      if (err) return ResponseService.json(400, res, "Beacon could not be destroyed", err.Errors)
      var responseData = {
        beacon
      }
      return ResponseService.json(200, res, "Beacon destroyed succesfully", responseData)
    })
  },

  index: async (req, res) => {
    var totalCount;
		Beacon.getTotalCount().then(count => { totalCount = count })
    var options = {
			limit: req.param('limit') || undefined,
			skip: req.param('skip') || undefined,
			sort: req.param('sort') || 'createdAt desc' // columnName desc||asc
    };
    var beacons = await Beacon.find(options).populate('locations')
                  .intercept('UsageError', (err) => {
                    return ResponseService.json(400, res, "Beacon with Locations could not be populated: invalid data.", err)
                  });
    var responseData = {
      beacons,
      skip: options.skip,
			limit: options.limit,
			total: totalCount || 0
    }
    if (responseData.total === 0) return ResponseService.json(204, res, responseData)
    return ResponseService.json(200, res, responseData)
  },

  show: async (req, res) => {
    var beacon = await Beacon.find(req.param('beacon-id')).populate('locations')
                  .intercept('UsageError', (err) => {
                    return ResponseService.json(400, res, "Beacon with Locations could not be populated: invalid data", err)
                  });
    var responseData = {
      beacon
    }
    if (beacon.length <= 0) return ResponseService.json(204, res, responseData)
    return ResponseService.json(200, res, responseData)
  },

};

