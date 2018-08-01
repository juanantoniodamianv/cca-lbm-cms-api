/* var admin = require('firebase-admin');

var serviceAccount = require('./fcm/cca-lbm-api-dev-firebase-adminsdk-c6oj8-1928069b42.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cca-lbm-api-dev.firebaseio.com'
})

module.exports = {
  friendlyName: 'Send push notification through Firebase Cloud Messages',

  description: 'Send push notification through Firebase Cloud Messages',

  inputs: {
    device: {
      type: 'string',
      required: true,
      description: 'Device Id corresponding to the user'
    },
    title: {
      type: 'string',
      defaultsTo: 'This is an automated message. Please, ignore it'
    },
    body: {
      type: 'string',
      defaultsTo: 'Send push notification through Firebase Cloud Messages'
    },
    payload: {
      type: 'json',
      description: 'Key-value pairs to send in the push notification',
      defaultsTo: {}
    },
    opts: {
      type: 'json',
      description: 'FCM specific settings',
      defaultsTo: {}
    }
  },

  exits: {
    success: {
      outputFriendlyName: 'Push notification sent',
      outputDescription: 'Push notification sent'
    },
    error: {
      outputFriendlyName: 'Push notification failed',
      outputDescription: 'Push notification failed'
    }
  },
  
  fn: async (inputs, exits) => {
    try {
      const { device, title, body, payload, opts } = inputs
      const message = Object.assign({ notification: { title, body }, token: device, data: payload }, opts)
      const result = await admin.messaging(app).send(message)
      return exits.success(result)
    }catch(err) {
      return exits.error(err)
    }
  }
} */