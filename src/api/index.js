import store from '@/store'

const queries = {
  getCurrentPoll: function () {
    const pollQuery = {
      $sort: {startDateTime: -1},
      $limit: 1,
      startDateTime: {
        $gte: new Date().getTime()
      },
      endDateTime: {
        $lt: new Date().getTime()
      }
    }

    return store.dispatch('poll/find', ({pollQuery}))
  }
}

export default queries
