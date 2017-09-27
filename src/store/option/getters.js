export default {
  getOptionsForPoll: (state, getters) => (pollId) => {
    return getters.find({query: {
      poll_id: pollId
    }}).data
  },
  getOptionsForCurrentPoll: (state, getters, rootState, rootGetters) => {
    const activePoll = rootGetters['poll/getActivePoll']
    if (activePoll) {
      return getters.getOptionsForPoll(activePoll._id)
    }
  }
}
