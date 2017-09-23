import store from '@/store'

const queries = {
  getCurrentPoll: function () {
    return store.dispatch('poll/find', {query: {
      $sort: {startDateTime: -1},
      $limit: 100
      // startDateTime: {
      //   $lt: store.getters['time/getNow']
      // }
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
  }
}

export default queries
