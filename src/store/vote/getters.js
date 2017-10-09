
import groupBy from 'lodash/groupBy'
import loMap from 'lodash/map'

export default {
  userVotes: (state, getters, rootState, rootGetters) => {
    const user = rootState.auth.user
    if (rootGetters['poll/getActivePoll'] && user) {
      return getters.find({query: {$limit: 1000, poll_id: rootGetters['poll/getActivePoll']._id, user_id: user._id}})
    }
    return null
  },
  votesRemaining: (state, getters, rootState, rootGetters) => {
    let activePoll = rootGetters['poll/getActivePoll']
    if (activePoll) {
      return activePoll.numberOfVotes - getters.userVotes.total
    }
    return null
  },
  getVotesByOption: (state, getters, rootState, rootGetters) => pollId => {
    const votes = Object.values(state.keyedById).filter(v => v.poll_id === pollId)
    const groupedVotes = groupBy(votes, 'option_id')
    return loMap(groupedVotes, (value, key) => ({option_id: key, votes: value}))
  },
  getVoteCountsByOption: (state, getters, rootState, rootGetters) => pollId => {
    return getters.getVotesByOption(pollId)
      .map(gv => ({option_id: gv.option_id, totalVotes: gv.votes.length}))
  },
  getGraphData: (state, getters, rootState, rootGetters) => pollId => {
    const options = getters.getVoteCountsByOption(pollId)
    const data = options.reduce((acc, option) => { acc.push(option.totalVotes); return acc }, [])
    const labels = options.reduce((acc, optionData) => { const option = rootGetters['option/get'](optionData.option_id); if (option) { acc.push(option.name) } else { acc.push('Unknown') }; return acc }, [])
    return {'data': data, 'labels': labels}
  },
  getHighestVotedOptionsForPoll: (state, getters, rootState, rootGetters) => pollId => {
    const voteCountByOption = getters.getVoteCountsByOption(pollId)
    const maxVote = voteCountByOption.reduce((acc, value) => {
      return (acc >= value.totalVotes ? acc : value.totalVotes)
    }, 0)
    return voteCountByOption.reduce((acc, value) => {
      if (value.totalVotes === maxVote) {
        const option = rootGetters['option/get'](value.option_id)
        if (option) {
          acc.push(option.name)
        } else {
          acc.push('Unknown')
        }
      }
      return acc
    }, [])
  }
}
