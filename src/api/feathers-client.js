import feathers from '@feathersjs/client'
import io from 'socket.io-client'
import store from '@/store' // used for transition notification

let socket

if (process.env.BRANCH && process.env.BRANCH.trim() === 'develop') {
  try {
    socket = io('https://staging-api.jonathansmovies.com', {
      transports: ['websocket']
    })
  } catch (e) {
    console.error(e)
    console.error('Unable to create socket to staging server')
  }
  console.info('Running staging environment!')
} else if (process.env.NODE_ENV === 'production') {
  try {
    socket = io('https://api.jonathansmovies.com', {
      transports: ['websocket']
    })
  } catch (e) {
    console.error(e)
    console.error('Unable to create socket to live server')
  }
} else {
  try {
    socket = io('http://localhost:3030', { transports: ['websocket'] })
  } catch (e) {
    console.error(e)
    console.error('Unable to create local development socket')
  }
}

let app = feathers()
  .configure(feathers.socketio(socket))
  .configure(feathers.authentication({ storage: window.localStorage }))

app.service('/users')
app.service('/poll')
app.service('/option')
app.service('/vote')
app.service('/films')
app.service('/time')
app.service('/users-online')
app.service('/recommendations')

app.service('/poll').on('transition', data => {
  const numberOfVotes = store.getters['vote/votesRemaining']
  const text = numberOfVotes == null ? 'Voting has begun' : `Voting has begun! You have ${numberOfVotes} votes.`
  store.dispatch('snackbar/setText', {
    text: text,
    isPersistent: true
  })
})

app.service('/collection').on('patched', data => {
  store.commit('films/clearAll')
  // data.current contains the current string for the correct collection
  // TODO: We should do things here like clear out films
})

export default app
