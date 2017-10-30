import feathers from 'feathers'
import hooks from 'feathers-hooks'
import socketio from 'feathers-socketio'
import auth from 'feathers-authentication-client'
import io from 'socket.io-client'

let socket
// Change Netlify staging env variable to 1 if the staging server is setup, else develop will use production API
if (process.env.BRANCH && process.env.BRANCH === 'develop' && process.env.STAGING === '1') {
  socket = io('https://staging-api.jonathansmovies.com', {'transports': ['websocket']})
} else if (process.env.NODE_ENV === 'production') {
  socket = io('https://api.jonathansmovies.com', {'transports': ['websocket']})
} else {
  socket = io('http://localhost:3030', {'transports': ['websocket']})
}

const feathersClient = feathers()
  .configure(hooks())
  .configure(socketio(socket))
  .configure(auth({storage: window.localStorage}))

feathersClient.service('/users')
feathersClient.service('/poll')
feathersClient.service('/option')
feathersClient.service('/vote')
feathersClient.service('/time')

export default feathersClient
