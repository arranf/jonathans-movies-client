import store from '@/store'

const queries = {
  getCurrentPoll: function () {
    return store.dispatch('poll/find', {query: {
      $sort: {endDateTime: -1},
      $limit: 100//, 
      // startDateTime: {
      //   $lt: store.getters['time/getNow']
      // },
      // endDateTime: {
      //   $gte: store.getters['time/getNow']
      // }
    }})
  },
  getVotesForMostRecentPoll: function (pollId) {
    return store.dispatch('vote/find', {pageinate: false,
      query: {
        $limit: 100,
        poll_id: pollId
      }})
  },
  getOptionsForMostRecentPoll: function (pollId) {
    return store.dispatch('option/find', {pageinate: false,
      query: {
        $limit: 100,
        poll_id: pollId
      }})
  },
  getVotesForCurrentPoll: function () {
    const poll = store.getters['poll/getActivePoll']
    const pollId = poll._id
    if (poll && pollId) {
      return store.dispatch('vote/find', {pageinate: false,
        query: {
          $limit: 1000,
          poll_id: pollId
        }})
    }
    return Promise.reject(new Error('Could not get current poll'))
  },
  getFilmSuggestions: function (movieName, limit = 5) {
    if (movieName && movieName.length > 0) {
      return store.dispatch('films/find', {query: {
        $limit: limit,
        $search: movieName
      }})
    }
    return Promise.resolve()
  },
  getFilms: function (skip = 0, limit = 50, sort = {name: 1}, shouldPageinate = false) {
    return store.dispatch('films/find', {paginate: false,
      query: {
        $limit: limit,
        $sort: sort,
        $skip: skip
      }})
  }
}

export default queries
