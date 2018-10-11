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
      "name", "contactEmail", "locationNumber", "memberId", "address1", "address2", "city", "state", "postalCode", "active", "locationBeaconID"
    ]
    var data = _.pick(req.body, allowedParameters);
    var newLocation = await Location.create(data)
      .intercept('E_UNIQUE', (err) => {
        return ResponseService.json(400, res, "Location Number already in use.", err)
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
		Location.destroy(req.param('id'), async (err, location) => {
			if (err) return ResponseService.json(400, res, "Location could not be destroyed", err.Errors)
      await Beacon.destroy({location: req.param('id')});
      await Geofence.destroy({location: req.param('id')});
      await MessageHistory.destroy({location: req.param('id')});
      var responseData = {
				location
			}
			return ResponseService.json(200, res, "Location destroyed succesfully", responseData)
		})
  },
  
  index: async (req, res, next) => {
    var totalCount;
		var options = {
			limit: req.param('limit') || undefined,
			skip: req.param('skip') || undefined,
			sort: req.param('sort') || 'createdAt desc' // columnName desc||asc
    };
    await Location.getTotalCount().then(count => {
      totalCount = count;
    })
    var locations = await Location.find(options)
                            .populate('messages')
                            .populate('beacons')
                            .populate('geofences')
                            .intercept('UsageError', (err) => {
                              return ResponseService.json(400, res, "Locations with Messages could not be populated: invalid data.", err)
                            });
    // --> COUNT method for message, beacon and geofence relationship
    locations.forEach(location => {
      location.messages = location.messages.length
      location.beacons = location.beacons.length
      location.geofences = location.geofences.length
    });
    var responseData = {
      locations,
      skip: options.skip,
			limit: options.limit,
			total: totalCount || locations.length
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
    var options = {
			sort: req.param('sort') || 'createdAt desc' // columnName desc||asc
		};

    if (!req.param('locationid')) return ResponseService.json(401, res, "LocationId path param are required.");
    var location = await Location.find({
      where: { id: req.param('locationid') }
    })
    .populate('messages', { sort: options.sort })
    .intercept('UsageError', (err) => {
      return ResponseService.json(400, res, "Messages with Locations could not be populated: invalid data.", err)
    });

    var responseData = {
      location,
    }
    if (location.length <= 0) return ResponseService.json(204, res, responseData)
    return ResponseService.json(200, res, responseData)
  },

  searchAllLocationMessages: async (req, res) => {
    if (!req.param('locationid')) return ResponseService.json(401, res, "LocationId path param are required.");
    
    var db = Message.getDatastore().manager;
    var value = new RegExp(req.param('value'));
    var messageIds = [];
    var options = {
      sort: req.param('sort') || 'createdAt desc'
    };

    db.collection('message').find({
      $or: [
        {title: {$regex: value, $options: 'i'}},
        {message: {$regex: value, $options: 'i'}},
        {deeplink: {$regex: value, $options: 'i'}}
      ]
    },{"_id":1})
    .toArray(async (err, messages) => {
      if (err) return ResponseService.json(400, res, "Messages could not be found: invalid data", err)
      Object.keys(messages).forEach(key => {
        message = messages[key];
        messageIds.push(String(message['_id']));
      });

      var resultMessages = await Location.find({
        where: { id: req.param('locationid') }
      })
      .populate('messages', { where: {id: messageIds}, sort: options.sort })
      .intercept('UsageError', (err) => {
        return ResponseService.json(400, res, "Messages with Locations could not be populated: invalid data", err)
      });
      
      var responseData = {
        location: resultMessages
      }

      return ResponseService.json(200, res, responseData)
    })

  },

  search: async (req, res) => {
    var db = Location.getDatastore().manager;
    var value = new RegExp(req.param('value'));
    var locationIds = [];
    var options = {
			//limit: req.param('limit') || undefined,
			//skip: req.param('skip') || undefined,
			sort: req.param('sort') || 'createdAt desc' // columnName desc||asc
		};
        
    db.collection('location').find({
      $or: [
        {name: {$regex: value, $options: 'i'}},
        {memberId: {$regex: value, $options: 'i'}}
      ]
    },{"_id":1}) 
    .toArray( async (err, locations) => {
      if (err) return ResponseService.json(400, res, "Locations could not be found: invalid data.", err)

      Object.keys(locations).forEach(key => {
        location = locations[key];     
        locationIds.push(String(location['_id']));
      });
          
      var resultLocations = await Location.find({
        id: { in: locationIds }
      })
      .sort(options.sort)
      .populate('messages')
      .populate('beacons')
      .populate('geofences')
      .intercept('UsageError', (err) => {
        return ResponseService.json(400, res, "Locations with Messages could not be populated: invalid data.", err)
      });
      // --> COUNT method for message, beacon and geofence relationship
      resultLocations.forEach(location => {
        location.messages = location.messages.length
        location.beacons = location.beacons.length
        location.geofences = location.geofences.length
      });
      var responseData = {
        locations: resultLocations
      }
      return ResponseService.json(200, res, responseData)

    }); 

  },

};

