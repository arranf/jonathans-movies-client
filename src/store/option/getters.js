export default {
  getOptionsForPoll: (state, getters) => poll => {
    const options = getters.find({
      query: {
        $limit: 100,
        poll_id: poll._id
      }
    }).data
    return options
  },
  getOptionsForPollByUser: (state, getters, rootState, rootGetters) => (
    poll,
    userId
  ) => {
    return getters
      .getOptionsForPoll(poll)
      .filter(p => p.added_by_user_id === userId)
  },
  getOptionsForCurrentPoll: (state, getters, rootState, rootGetters) => {
    const activePoll = rootGetters['poll/getActivePoll']
    if (activePoll) {
      return getters.getOptionsForPoll(activePoll)
    }
    return []
  },
  getUserNominations: (state, getters, rootState, rootGetters) => {
    const activePoll = rootGetters['poll/getActivePoll']
    const user = rootState.auth.user
    if (activePoll && user && user._id) {
      return getters.getOptionsForPollByUser(activePoll, user._id)
    }
    return []
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
  isOptionForCurrentPoll: (
    state,
    getters,
    rootState,
    rootGetters
  ) => filmId => {
    const activePoll = rootGetters['poll/getActivePoll']
    if (!activePoll || !filmId) {
      return false
    }
    return getters
      .getOptionsForPoll(activePoll)
      .some(o => o.film_id === filmId)
  }
}
