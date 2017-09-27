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
  remainingTimeWordsForCurrentPoll (state, getters) {
    if (getters.getActivePoll) {
      return 'Poll closes in ' + utils.humanizeTimeToNowPrecise(getters.getActivePoll.endDateTime)
    }
    return 'No Current Poll'
  },
  howLongAgoMostRecentPoll: (state, getters) => {
    if (getters.getMostRecentPoll) {
      return 'Last poll was ' + utils.humanizeTimeToNowImprecise(getters.getMostRecentPoll.endDateTime) + ' ago'
    }
    return ''
  }
}
