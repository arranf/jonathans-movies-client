import { humanizeTimeToNowPrecise, round } from "@/utils";

export default {
  getActivePoll(state, _getters, rootState, _rootGetters) {
    let currentDateTime = rootState.time.now;
    return (
      Object.values(state.keyedById)
        // If a.eDT < b.eDT, a comes before b (orders first finishing first)
        .sort((a, b) => (a.endDateTime < b.endDateTime ? -1 : 1))
        .find(
          (p) =>
            p.startDateTime <= currentDateTime &&
            p.endDateTime > currentDateTime
        )
    );
  },
  getMostRecentPoll(state, _getters, rootState, _rootGetters) {
    let currentDateTime = rootState.time.now;
    let polls = Object.values(state.keyedById);
    return (
      polls
        // If a.eDT > b.eDT, a comes before b (orders later finishing first)
        .sort((a, b) => (a.endDateTime > b.endDateTime ? -1 : 1))
        .find((p) => p.endDateTime < currentDateTime)
    );
  },
  remainingTimeWordsForCurrentPoll(_state, getters) {
    if (getters.getActivePoll) {
      return (
        "Poll closes in " +
        humanizeTimeToNowPrecise(getters.getActivePoll.endDateTime)
      );
    }
    return "No Current Poll";
  },
  remainingTimeInNominationWordsForCurrentPoll(_state, getters) {
    if (getters.getActivePoll) {
      return (
        "Nominations close in " +
        humanizeTimeToNowPrecise(getters.getActivePoll.pollTransitionDateTime)
      );
    }
    return "No Current Poll";
  },
  isCurrentPollInNomination(_state, getters, rootState) {
    let activePoll = getters.getActivePoll;
    if (activePoll) {
      let currentDateTime = rootState.time.now;
      return (
        activePoll.startDateTime <= currentDateTime &&
        activePoll.pollTransitionDateTime !== undefined &&
        activePoll.pollTransitionDateTime > currentDateTime
      );
    }
    return false;
  },
  percentageOfCurrentPhaseComplete(_state, getters, rootState) {
    let activePoll = getters.getActivePoll;
    let currentDateTime = rootState.time.now;
    if (getters.isCurrentPollInNomination) {
      let total = activePoll.pollTransitionDateTime - activePoll.startDateTime;
      return (
        100 -
        ((activePoll.pollTransitionDateTime - currentDateTime) / total) * 100
      );
    } else if (getters.isCurrentPollInVoting) {
      let total;
      if (activePoll.pollTransitionDateTime) {
        total = activePoll.endDateTime - activePoll.pollTransitionDateTime;
      } else {
        total = activePoll.endDateTime - activePoll.startDateTime;
      }
      return 100 - ((activePoll.endDateTime - currentDateTime) / total) * 100;
    }
    return 0;
  },
  isCurrentPollInVoting(_state, getters, rootState) {
    let activePoll = getters.getActivePoll;
    if (activePoll) {
      let currentDateTime = rootState.time.now;
      return (
        activePoll.startDateTime <= currentDateTime &&
        activePoll.endDateTime > currentDateTime &&
        ((activePoll.pollTransitionDateTime !== undefined &&
          activePoll.pollTransitionDateTime <= currentDateTime) ||
          activePoll.pollTransitionDateTime === undefined)
      );
    }
  },
  doesCurrentPollHaveNominations(_state, getters) {
    let activePoll = getters.getActivePoll;
    if (activePoll) {
      return activePoll.pollTransitionDateTime != null;
    }
    return false;
  },
};
