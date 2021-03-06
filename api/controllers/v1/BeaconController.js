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
    if (!req.body.name || !req.body.majorId || !req.body.minorId || !req.body.triggerProximity || !req.param('locationid')) return ResponseService.json(401, res, "Beacon Name, MajorId, MinorId, Proximity and Location Number are required.");

    /* Verify if the Beacon parameter exists */
    if (Location.getLocation(req.param('locationid')) === undefined) return ResponseService.json(400, res, "The specified location does not exist.", err)
    if ((req.body.messageOnTrigger === undefined) || (Location.isRelationship(req.body.messageOnTrigger, req.param('locationid'))) === undefined) return ResponseService.json(400, res, "Relationship with messageOnTrigger does not exist.")
    /* MessageAfterDelay is not required */
    //if ((req.body.messageAfterDelay === undefined) || (Location.isRelationship(req.body.messageAfterDelay, req.param('locationid'))) === undefined) return ResponseService.json(400, res, "Relationship with messageAfterDelay does not exist.")
   
    /*  await Beacon.majorIdIsAvailable(req.body.majorId, req.body.minorId, req.param('locationid')).then(result => {
      if (result != true) {
        return ResponseService.json(400, res, 'This majorId/minorId is already in use');
      } 
    }) */
    

    var allowedParameters = [
      "name", "beaconType", "majorId", "minorId", "triggerProximity", "messageOnTrigger", "enableMessageOnTrigger", "messageAfterDelay", "enableMessageAfterDelay", "delayHours", "location"
    ]
    req.body.location = req.param('locationid'); // mmm bad code
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
    if ((req.body.messageOnTrigger === undefined) || (Location.isRelationship(req.body.messageOnTrigger, req.param('locationid'))) === undefined) return ResponseService.json(400, res, "Relationship with messageOnTrigger does not exist.")
    if ((req.body.messageAfterDelay === undefined) || (Location.isRelationship(req.body.messageAfterDelay, req.param('locationid'))) === undefined) return ResponseService.json(400, res, "Relationship with messageAfterDelay does not exist.")
    
    var allowedParameters = [
      "name", "beaconType", "majorId", "minorId", "triggerProximity", "messageOnTrigger", "enableMessageOnTrigger", "messageAfterDelay", "enableMessageAfterDelay", "delayHours"
    ]
    var data = _.pick(req.body, allowedParameters);

    Beacon.update(req.param('beaconid'), data, (err, beacon) => {
      if (err) return ResponseService.json(400, res, "Beacon could not be updated", err.Errors)
      var responseData = {
        beacon
      }
      return ResponseService.json(200, res, "Beacon updated succesfully", responseData)
    })
  },

  destroy: (req, res) => {
    Beacon.destroy(req.param('beaconid'), (err, beacon) => {
      if (err) return ResponseService.json(400, res, "Beacon could not be destroyed", err.Errors)
      var responseData = {
        beacon
      }
      return ResponseService.json(200, res, "Beacon destroyed succesfully", responseData)
    })
  },

  index: async (req, res) => {
    var totalCount;
    var locationId = req.param('locationid') || undefined
    var options = {
			limit: req.param('limit') || undefined,
			skip: req.param('skip') || undefined,
			sort: req.param('sort') || 'createdAt desc' // columnName desc||asc
    };
    Beacon.getTotalCount(locationId).then(count => { totalCount = count })
    if (req.param('locationid') !== undefined) {
      var beacons = await Beacon.find({
                              where: { location: req.param('locationid') },
                              skip: options.skip,
                              limit: options.limit,
                              sort: options.sort
                            })
                            .populate('messageOnTrigger')
                            .populate('messageAfterDelay')
                            .populate('location')
                            .intercept('UsageError', (err) => {
                              return ResponseService.json(400, res, "Beacons could not be populated: invalid data.", err)
                            });
      var responseData = {
        beacons,
        skip: options.skip,
        limit: options.limit,
        total: totalCount || 0
      }
    } else {
      var beacons = await Beacon.find(options)
                      .populate('messageOnTrigger')
                      .populate('messageAfterDelay')
                      .populate('location')
                      .intercept('UsageError', (err) => {
                        return ResponseService.json(400, res, "Beacon with Locations could not be populated: invalid data.", err)
                      });
      var responseData = {
        beacons,
        skip: options.skip,
        limit: options.limit,
        total: totalCount || 0
      }
    }
    if (responseData.total === 0) return ResponseService.json(204, res, responseData)
    return ResponseService.json(200, res, responseData)
  },

  indexPerLocationNumber: async (req, res) => {
    if (req.param('locationBeaconID') === undefined)  return ResponseService.json(400, res, "Error with retrieved Beacons.", err)
    var location = await Location.findOne({ locationBeaconID: req.param('locationBeaconID') })
      //.select(['id']) 
      .populate('beacons', { select: ['id', 'majorId', 'minorId', 'triggerProximity'] }) 
      .populate('geofences', { select: ['id', 'radius', 'longitude', 'latitude'] }) 
      .intercept('UsageError', (err) => {
        return ResponseService.json(400, res, "Beacons and Geofences could not be populated: invalid data.", err)
      });
    if (location === undefined) return ResponseService.json(404, res, "This location do not exist.");
    var responseData = {
      locationBeaconID: location.locationBeaconID,
      beacons: location.beacons,
      geofences: location.geofences
    }
    if (responseData.total === 0) return ResponseService.json(204, res, responseData)
    //return ResponseService.json(200, res, responseData)
    return res.json(responseData)
  },

  show: async (req, res) => {
    var beacon = await Beacon.find(req.param('beaconid')).populate('location')
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

