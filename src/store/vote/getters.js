
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
  /**
   * Produces an object {option_id: id, votes: []}
   */
  getVotesByOption: (state, getters, rootState, rootGetters) => pollId => {
    const optionsForPoll = rootGetters['option/getOptionsForPoll'](pollId)
    const votes = Object.values(state.keyedById).filter(v => v.poll_id === pollId)
    const groupedVotes = groupBy(votes, 'option_id')
    let votesByOption = loMap(groupedVotes, (value, key) => ({option_id: key, votes: value}))
    optionsForPoll.forEach(option => {
      if (!votesByOption.find(gv => gv.option_id === option._id)) {
        votesByOption.push({option_id: option._id, votes: []})
      }
    })
    return votesByOption
  },
  /**
   * Produces an array of objects [{option_id: id, votes: count}]
   */
  getVoteCountsByOption: (state, getters, rootState, rootGetters) => pollId => {
    return getters.getVotesByOption(pollId)
      .map(gv => ({option_id: gv.option_id, totalVotes: gv.votes.length}))
  },
  /**
   * Produces an array [{name: 'Kill Bill', votes: 12}]
   */
  getGraphData: (state, getters, rootState, rootGetters) => pollId => {
    const options = getters.getVoteCountsByOption(pollId)
    function getName (id) {
      const option = rootGetters['option/get'](id)
      return option.name ? option.name : 'Unknown'
    }
    const data = options.reduce((acc, option) => { acc.push({votes: option.totalVotes, name: getName(option.option_id)}); return acc }, [])
    return data.sort((a, b) => {
      if (a.totalVotes < b.totalVotes) {
        return -1
      } else if (a.totalVotes > b.totalVotes) {
        return 1
      }
      return 0
    })
  },
  getHighestVotedOptionsForPoll: (state, getters, rootState, rootGetters) => pollId => {
    const voteCountByOption = getters.getVoteCountsByOption(pollId)
    const maxVote = voteCountByOption.reduce((acc, value) => {
      return (acc >= value.totalVotes ? acc : value.totalVotes)
    }, 0)
    if (maxVote === 0) {
      return []
    }
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
  },
  getNumberOfUniqueVoters: (state, getters) => pollId => {
    const voterIds = Object.values(state.keyedById).filter(v => v.poll_id === pollId).map(v => v.user_id)
    return new Set(voterIds).size
  }
}
