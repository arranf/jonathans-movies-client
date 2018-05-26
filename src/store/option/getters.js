export default {
  getOptionsForPollByUser: (state, getters) => (poll, userId) => {
    return poll.options.filter(p => p.added_by_user_id === userId)
  },
  getOptionsForCurrentPoll: (state, getters, rootState, rootGetters) => {
    const activePoll = rootGetters['poll/getActivePoll']
    if (activePoll) {
      return activePoll.options
    }
    return []
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
    return activePoll.options.some(o => o.film_id === filmId)
  }
}
