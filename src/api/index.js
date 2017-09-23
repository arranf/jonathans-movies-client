import store from '@/store'

const queries = {
  getCurrentPoll: function () {
    return store.dispatch('poll/find', {query: {
      $sort: {startDateTime: -1},
      $limit: 100,
      // startDateTime: {
      //   $lt: store.getters['time/getNow']
      // }
      // endDateTime: {
      //   $gte: store.getters['time/getNow']
      // }
    }})
  }
}

export default queries
