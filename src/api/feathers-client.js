import feathers from 'feathers'
import hooks from 'feathers-hooks'
import socketio from 'feathers-socketio'
import auth from 'feathers-authentication-client'
import io from 'socket.io-client'

let socket
if (process.env.NODE_ENV === 'production') {
  socket = io('https://api.jonathansmovies.com', {'transports': ['websocket']})
} else if (process.env.NODE_ENV === 'staging') {
  socket = io('jonathans-movies-dev.eu-west-1.elasticbeanstalk.com', {'transports': ['websocket']})
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
