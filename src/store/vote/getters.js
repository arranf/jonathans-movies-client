export default {
  userVotes: (_state, getters, rootState, rootGetters) => {
    const user = rootState.auth.user;
    if (rootGetters["poll/getActivePoll"] && user) {
      return getters.find({
        query: {
          $limit: 1000,
          poll_id: rootGetters["poll/getActivePoll"]._id,
          user_id: user._id,
        },
      });
    }
    return null;
  },
  votesRemaining: (_state, getters, _rootState, rootGetters) => {
    let activePoll = rootGetters["poll/getActivePoll"];
    const userVotes = getters.userVotes;
    if (activePoll && userVotes && userVotes.total != null) {
      return activePoll.numberOfVotes - userVotes.total;
    }
    return null;
  },
};
