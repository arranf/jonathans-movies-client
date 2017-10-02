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
  }
}

export default queries
