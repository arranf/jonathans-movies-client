export default {
  getOptionsForPoll: (state, getters) => (pollId) => {
    const options = getters.find({query: {
      $limit: 100,
      poll_id: pollId
    }}).data
    return options
  },
  getOptionsForPollByUser: (state, getters) => (pollId, userId) => {
    const options = getters.find({query: {
      $limit: 50,
      poll_id: pollId,
      added_by_user_id: userId
    }}).data
    return options
  },
  getOptionsForCurrentPoll: (state, getters, rootState, rootGetters) => {
    const activePoll = rootGetters['poll/getActivePoll']
    if (activePoll) {
      return getters.getOptionsForPoll(activePoll._id)
    }
  },
  getUserNominations: (state, getters, rootState, rootGetters) => {
    const activePoll = rootGetters['poll/getActivePoll']
    const user = rootState.auth.user
    if (activePoll && user && activePoll._id && user._id) {
      return getters.getOptionsForPollByUser(activePoll._id, user._id)
    }
  },
  nominationsRemaining: (state, getters, rootState, rootGetters) => {
    const activePoll = rootGetters['poll/getActivePoll']
    const userNominations = getters.getUserNominations
    if (activePoll && userNominations) {
      return activePoll.numberOfNominations - (userNominations.length || 0)
    }
    return 0
  },
  hasNominationsRemaining: (state, getters) => {
    return getters.nominationsRemaining > 0
  },
  isOptionForCurrentPoll: (state, getters, rootState, rootGetters) => filmId => {
    const activePoll = rootGetters['poll/getActivePoll']
    if (!activePoll || !filmId) { return false }
    return getters.list.some(o => o.film_id === filmId && o.poll_id === activePoll._id)
  }
}
