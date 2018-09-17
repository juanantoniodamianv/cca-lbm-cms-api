const admin = require('firebase-admin')

const app = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FCM_PROJECT_ID,
    clientEmail: process.env.FCM_CLIENT_EMAIL,
    privateKey: process.env.FCM_PRIVATE_KEY
  })
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

  verifyToken: (idToken) => {
    admin.auth().verifyIdToken(idToken)
      .then(function(decodedToken) {
        var uid = decodedToken.uid;
        return uid;
      }).catch(function(error) {
        sails.log.warn('Error, Device Id Token invalid:', error);
        return error;
      });
  },
  
  // enviar push notification on trigger.. ver-> on delay
  sendPushNotification: async (inputs, exits) => {
    // try {
    //   const { device, title, body, payload, opts } = inputs
    //   const message = Object.assign({ notification: { title, body }, token: device, data: payload }, opts)
    //   const result = await admin.messaging(app).send(message)
    //   return exits.success(result)
    // }catch(error) {
    //   return exits.error()
    // }
    
    //const { device, title, body } = inputs
    const token = inputs.deviceId;
    const title = inputs.title;
    const body = inputs.body;
    const url = inputs.url;

    const message = Object.assign({ notification: { title, body }, token, data: {'url': url} })
    // var message = {
    //   notification: {
    //     title,
    //     body
    //   },
    //   token: device
    // };
    sails.log.info("*****************")
    sails.log.info(message)

    const result = await admin.messaging(app).send(message).then((response) => {
      sails.log.info('Successfully sent message:', response);
    })
    .catch((error) => {
      sails.log.warn('Error sending message:', error);
    });
  }
}