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
  nominationsRemaining: (state, getters) => {
    const userNominations = getters.getUserNominations
    if (userNominations && userNominations.length > 0) {
      return 1
    }
    return 0
  },
  hasNominationsRemaining: (state, getters) => {
    return getters.nominationsRemaining > 0
  }
}
