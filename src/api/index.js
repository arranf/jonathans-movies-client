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
    return store.dispatch('vote/find', {query: {
      $limit: 100,
      poll_id: pollId
    }})
  },
  getOptionsForMostRecentPoll: function (pollId) {
    return store.dispatch('option/find', {query: {
      $limit: 100,
      poll_id: pollId
    }})
  },
  getAllFilms: function () {
    return store.dispatch('films/find', {query: {
      $limit: 10000
    }})
  }
}

export default queries
