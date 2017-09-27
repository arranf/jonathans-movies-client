export default {
  getOptionsForPoll: (state, getters) => (pollId) => {
    const options = getters.find({query: {
      poll_id: pollId
    }}).data
    return options
  },
  getOptionsForCurrentPoll: (state, getters, rootState, rootGetters) => {
    const activePoll = rootGetters['poll/getActivePoll']
    if (activePoll) {
      return getters.getOptionsForPoll(activePoll._id)
    }
  }
}
