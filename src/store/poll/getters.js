import { humanizeTimeToNowPrecise } from '@/utils'

export default {
  getActivePoll (state, getters, rootState, rootGetters) {
    let currentDateTime = rootState.time.now
    return (
      Object.values(state.keyedById)
        // If a.eDT < b.eDT, a comes before b (orders first finishing first)
        .sort((a, b) => (a.endDateTime < b.endDateTime ? -1 : 1))
        .find(
          p =>
            p.startDateTime <= currentDateTime &&
            p.endDateTime > currentDateTime
        )
    )
  },
  getMostRecentPoll (state, getters, rootState, rootGetters) {
    let currentDateTime = rootState.time.now
    let polls = Object.values(state.keyedById)
    return (
      polls
        // If a.eDT > b.eDT, a comes before b (orders later finishing first)
        .sort((a, b) => (a.endDateTime > b.endDateTime ? -1 : 1))
        .find(p => p.endDateTime < currentDateTime)
    )
  },
  remainingTimeWordsForCurrentPoll (state, getters) {
    if (getters.getActivePoll) {
      return (
        'Poll closes in ' +
        humanizeTimeToNowPrecise(getters.getActivePoll.endDateTime)
      )
    }
    return 'No Current Poll'
  },
  remainingTimeInNominationWordsForCurrentPoll (state, getters) {
    if (getters.getActivePoll) {
      return (
        'Nominations close in ' +
        humanizeTimeToNowPrecise(
          getters.getActivePoll.pollTransitionDateTime
        )
      )
    }
    return 'No Current Poll'
  },
  isCurrentPollInNomination (state, getters, rootState) {
    let activePoll = getters.getActivePoll
    if (activePoll) {
      let currentDateTime = rootState.time.now
      return (
        activePoll.startDateTime <= currentDateTime &&
        activePoll.pollTransitionDateTime !== undefined &&
        activePoll.pollTransitionDateTime > currentDateTime
      )
    }
    return false
  },
  percentageOfCurrentPhaseComplete (state, getters, rootState) {
    let activePoll = getters.getActivePoll
    let currentDateTime = rootState.time.now
    if (getters.isCurrentPollInNomination) {
      let total = activePoll.pollTransitionDateTime - activePoll.startDateTime
      return (
        100 -
        ((activePoll.pollTransitionDateTime - currentDateTime) / total) * 100
      )
    } else if (getters.isCurrentPollInVoting) {
      let total
      if (activePoll.pollTransitionDateTime) {
        total = activePoll.endDateTime - activePoll.pollTransitionDateTime
      } else {
        total = activePoll.endDateTime - activePoll.startDateTime
      }
      return 100 - ((activePoll.endDateTime - currentDateTime) / total) * 100
    }
    return 0
  },
  isCurrentPollInVoting (state, getters, rootState) {
    let activePoll = getters.getActivePoll
    if (activePoll) {
      let currentDateTime = rootState.time.now
      return (
        activePoll.startDateTime <= currentDateTime &&
        activePoll.endDateTime > currentDateTime &&
        ((activePoll.pollTransitionDateTime !== undefined &&
          activePoll.pollTransitionDateTime <= currentDateTime) ||
          activePoll.pollTransitionDateTime === undefined)
      )
    }
  },
  doesCurrentPollHaveNominations (state, getters) {
    let activePoll = getters.getActivePoll
    if (activePoll) {
      return activePoll.pollTransitionDateTime != null
    }
    return false
  }
}
