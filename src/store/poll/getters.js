import utils from '@/utils'

export default {
  getActivePoll (state, getters, rootState, rootGetters) {
    let currentDateTime = rootState.time.now
    return Object.values(state.keyedById)
      // If a.eDT < b.eDT, a comes before b (orders first finishing first)
      .sort((a, b) => a.endDateTime < b.endDateTime ? -1 : 1)
      .find(p => p.startDateTime <= currentDateTime && p.endDateTime > currentDateTime)
  },
  getMostRecentPoll (state, getters, rootState, rootGetters) {
    let currentDateTime = rootState.time.now
    let polls = Object.values(state.keyedById)
    return polls
      // If a.eDT > b.eDT, a comes before b (orders later finishing first)
      .sort((a, b) => a.endDateTime > b.endDateTime ? -1 : 1)
      .find(p => p.endDateTime < currentDateTime)
  },
  getPollFinishingUpTo: (state, getters, rootState, rootGetters) => withinMinutes => {
    let currentDateTime = rootState.time.now
    if (currentDateTime) {
      let polls = Object.values(state.keyedById)
      return polls
        // If a.eDT < b.eDT, a comes before b (orders first finishing first)
        .sort((a, b) => a.endDateTime < b.endDateTime ? -1 : 1)
        .find(p => p.startDateTime <= currentDateTime && (p.endDateTime + (60 * 100 * withinMinutes)) > currentDateTime)
    }
  },
  remainingTimeWordsForCurrentPoll (state, getters) {
    if (getters.getActivePoll) {
      return 'Poll closes in ' + utils.humanizeTimeToNowPrecise(getters.getActivePoll.endDateTime)
    }
    return 'No Current Poll'
  },
  remainingTimeInNominationWordsForCurrentPoll (state, getters) {
    if (getters.getActivePoll) {
      return 'Nominations close in ' + utils.humanizeTimeToNowPrecise(getters.getActivePoll.pollTransitionDateTime)
    }
    return 'No Current Poll'
  },
  howLongAgoMostRecentPoll: (state, getters) => {
    if (getters.getMostRecentPoll) {
      return 'Last poll was ' + utils.humanizeTimeToNowImprecise(getters.getMostRecentPoll.endDateTime) + ' ago'
    }
    return ''
  },
  isCurrentPollInNomination (state, getters, rootState, rootGetters) {
    let activePoll = getters.getActivePoll
    if (activePoll) {
      let currentDateTime = rootState.time.now
      return (activePoll.startDateTime <= currentDateTime &&
      activePoll.pollTransitionDateTime !== undefined &&
      activePoll.pollTransitionDateTime > currentDateTime)
    }
    return false
  },
  isCurrentPollInVoting (state, getters, rootState, rootGetters) {
    let activePoll = getters.getActivePoll
    if (activePoll) {
      let currentDateTime = rootState.time.now
      return (activePoll.startDateTime <= currentDateTime && ((activePoll.pollTransitionDateTime !== undefined &&
              activePoll.pollTransitionDateTime <= currentDateTime) || activePoll.endDateTime > currentDateTime))
    }
  },
  doesCurrentPollHaveNominations (state, getters) {
    let activePoll = getters.getActivePoll
    if (activePoll) {
      return activePoll.pollTransitionDateTime != null
    }
    return false
  },
  isNominationCurrentOrOverForPollFinishingUpTo: (state, getters, rootState, rootGetters) => withinMinutes => {
    const poll = getters.getPollFinishingUpTo(withinMinutes)
    if (poll) {
      let currentDateTime = rootState.time.now
      return (poll.startDateTime <= currentDateTime &&
        poll.pollTransitionDateTime !== undefined &&
        poll.pollTransitionDateTime > currentDateTime)
    }
    return false
  },
  isItResultsForPollFinishingUpTo: (state, getters, rootState, rootGetters) => withinMinutes => {
    const poll = getters.getPollFinishingUpTo(withinMinutes)
    if (poll) {
      let currentDateTime = rootState.time.now
      return poll.endDateTime <= currentDateTime
    }
    return false
  },
  isVotingCurrentOrOverForPollFinishingUpTo: (state, getters, rootState, rootGetters) => withinMinutes => {
    const poll = getters.getPollFinishingUpTo(withinMinutes)
    if (poll) {
      let currentDateTime = rootState.time.now
      return (poll.startDateTime <= currentDateTime && (poll.pollTransitionDateTime === undefined ||
        poll.pollTransitionDateTime <= currentDateTime))
    }
    return false
  }
}
