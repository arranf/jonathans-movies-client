import store from '@/store'
import feathersClient from './feathers-client'

export const getCurrentPoll = () =>
  store.dispatch('poll/find', {
    query: {
      $sort: { endDateTime: -1 },
      $limit: 20
    }
  })

export const getVotesForMostRecentPoll = (poll) =>
  store.dispatch('vote/find', {
    pageinate: false,
    query: {
      $limit: 1000,
      poll_id: poll._id
    }
  })

export const getOptionsForPoll = (pollId) =>
  store.dispatch('option/find', {
    pageinate: false,
    query: {
      $limit: 100,
      poll_id: pollId
    }
  })

export const getVotesForCurrentPoll = () => {
  const poll = store.getters['poll/getActivePoll']
  if (poll && poll._id) {
    return store.dispatch('vote/find', {
      pageinate: false,
      query: {
        $limit: 1000,
        poll_id: poll._id
      }
    })
  }
  return Promise.reject(new Error('Could not get current poll'))
}

export const getFilmSuggestions = (movieName, limit = 5) => {
  if (movieName && movieName.length > 0) {
    return store.dispatch('films/find', {
      query: {
        $limit: limit,
        $search: movieName
      }
    })
  }
  return Promise.resolve()
}

export const getFilms = (
  skip = 0,
  limit = 50,
  sort = { name: 1 },
  shouldPageinate = false
) =>
  store.dispatch('films/find', {
    paginate: false,
    query: {
      $limit: limit,
      $sort: sort,
      $skip: skip
    }
  })

export const addNomination = (film) => {
  const poll = store.getters['poll/getActivePoll']
  const pollId = poll._id
  const hasNominationsRemaining =
      store.getters['option/hasNominationsRemaining']

  if (!hasNominationsRemaining) {
    return Promise.reject(new Error('Nomination used'))
  }

  if (!pollId) {
    return Promise.reject(new Error('Missing poll id'))
  }
  if (film && film.name && film._id) {
    return store.dispatch('option/create', {
      name: film.name,
      poll_id: pollId,
      film_id: film._id
    })
  } else {
    return Promise.reject(new Error('Missing film information id'))
  }
}
export const stopPoll = () => {
  const poll = store.getters['poll/getActivePoll']
  const currentTime = store.getters['time/getNow']
  const data = { endDateTime: currentTime }
  store.dispatch('poll/patch', [poll._id, data, {}])
}

export const stopNominations = () => {
  const poll = store.getters['poll/getActivePoll']
  const currentTime = store.getters['time/getNow']
  const oldTransitionTime = poll.pollTransitionDateTime
  const data = {
    pollTransitionDateTime: currentTime,
    endDateTime: poll.endDateTime - (oldTransitionTime - currentTime)
  }
  store.dispatch('poll/patch', [poll._id, data, {}])
}

export const discoverMovies = (seenIds) =>
  store.dispatch('films/find', {
    paginate: false,
    query: {
      discover: true,
      _id: {
        $nin: seenIds
      }
    }
  })

export const getRecommendations = () =>
  feathersClient.service('/recommendations').get(store.state.auth.user._id)
