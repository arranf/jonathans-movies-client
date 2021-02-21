export default {
  getOptionsForPoll: (_state, getters) => (poll) => {
    const options = getters.find({
      query: {
        $limit: 100,
        poll_id: poll._id,
      },
    }).data;
    return options;
  },
  getOptionsForPollByUser: (_state, getters, _rootState, _rootGetters) => (
    poll,
    userId
  ) => {
    return getters
      .getOptionsForPoll(poll)
      .filter((p) => p.added_by_user_id === userId);
  },
  getOptionsForCurrentPoll: (_state, getters, _rootState, rootGetters) => {
    const activePoll = rootGetters["poll/getActivePoll"];
    if (activePoll) {
      return getters.getOptionsForPoll(activePoll);
    }
    return [];
  },
  getUserNominations: (_state, getters, rootState, rootGetters) => {
    const activePoll = rootGetters["poll/getActivePoll"];
    const user = rootState.auth.user;
    if (activePoll && user && user._id) {
      return getters.getOptionsForPollByUser(activePoll, user._id);
    }
    return [];
  },
  nominationsRemaining: (_state, getters, _rootState, rootGetters) => {
    const activePoll = rootGetters["poll/getActivePoll"];
    const userNominations = getters.getUserNominations;
    if (activePoll && userNominations) {
      const total =
        activePoll.numberOfNominations - (userNominations.length || 0);
      return total < 0 ? 0 : total;
    }
    return 0;
  },
  hasNominationsRemaining: (_state, getters) => {
    return getters.nominationsRemaining > 0;
  },
  isOptionForCurrentPoll: (_state, getters, _rootState, rootGetters) => (
    filmId
  ) => {
    const activePoll = rootGetters["poll/getActivePoll"];
    if (!activePoll || !filmId) {
      return false;
    }
    return getters
      .getOptionsForPoll(activePoll)
      .some((o) => o.film_id === filmId);
  },
};
