import feathers from '@feathersjs/client'
import io from 'socket.io-client'

let socket

// Change Netlify staging env variable to 1 if the staging server is setup, else develop will use production API
if (process.env.BRANCH && process.env.BRANCH === 'develop' && process.env.STAGING === '1') {
  try {
    socket = io('https://staging-api.jonathansmovies.com', {'transports': ['websocket']})
  } catch (e) {
    console.error(e)
    console.error('Unable to create socket to staging server')
  }
  console.info('Running staging environment!')
} else if (process.env.NODE_ENV === 'production') {
  try {
    socket = io('https://api.jonathansmovies.com', {'transports': ['websocket']})
  } catch (e) {
    console.error(e)
    console.error('Unable to create socket to live server')
  }
} else {
  try {
    socket = io('http://localhost:3030', {'transports': ['websocket']})
  } catch (e) {
    console.error(e)
    console.error('Unable to create local development socket')
  }
}

let feathersClient

if (process.env.NODE_ENV !== 'test') {
  feathersClient = feathers()
    .configure(feathers.socketio(socket))
    .configure(feathers.authentication({storage: window.localStorage}))

  feathersClient.service('/users')
  feathersClient.service('/poll')
  feathersClient.service('/option')
  feathersClient.service('/vote')
  feathersClient.service('/films')
  feathersClient.service('/time')
} else {
  // setup in memory services
  feathersClient = feathers()
    .configure(feathers.authentication({storage: window.localStorage}))

  const service = require('feathers-memory')
  feathersClient.service('/users', service())
  feathersClient.service('/poll', service())
  feathersClient.service('/option', service())
  feathersClient.service('/vote', service())
  feathersClient.service('/films', service())
  feathersClient.service('/time', service())
}

feathersClient.service('/poll')
  .on('transition', data => {
    function displayNotification () {
      if (Notification.permission === 'granted') {
        navigator.serviceWorker.getRegistration().then(function (reg) {
          var options = {
            body: 'Get voting!',
            icon: '/static/apple-touch-icon.png',
            vibrate: [100, 50, 100]
          }
          reg.showNotification('Voting Started', options)
        })
      }
    }
    Notification.requestPermission(function (status) {
      console.log('Notification permission status:', status)
      displayNotification()
    })
  })

export default feathersClient
