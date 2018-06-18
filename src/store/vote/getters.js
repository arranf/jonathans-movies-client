
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
    const userVotes = getters.userVotes
    if (activePoll && userVotes && userVotes.total != null) {
      return activePoll.numberOfVotes - userVotes.total
    }
    return null
  },
  /**
   * Produces an an array [{option_id: id, votes: []}]
   */
  getVotesByOption: (state, getters) => poll => {
    const votes = Object.values(state.keyedById).filter(v => v.poll_id === poll._id)
    const groupedVotes = groupBy(votes, 'option_id')
    let votesByOption = loMap(groupedVotes, (value, key) => ({option_id: key, votes: value}))
    // If votesByOption does not contain an option add it with 0 votes
    poll.options.forEach(option => {
      if (!votesByOption.find(gv => gv.option_id === option._id)) {
        votesByOption.push({option_id: option._id, votes: []})
      }
    })
    return votesByOption
  },
  /**
   * Produces an array of objects [{option_id: id, totalVotes: count}]
   */
  getVoteCountsByOption: (state, getters) => poll => {
    return getters.getVotesByOption(poll)
      .map(gv => ({option_id: gv.option_id, totalVotes: gv.votes.length}))
  },
  /**
   * Produces an array [{name: 'Kill Bill', votes: 12}]
   */
  getGraphData: (state, getters) => poll => {
    const voteCountsByOption = getters.getVoteCountsByOption(poll)

    function getName (id) {
      const option = poll.options.find(o => o._id === id)
      return option && option.name ? option.name : 'Unknown'
    }
    const data = voteCountsByOption.reduce((acc, option) => { acc.push({votes: option.totalVotes, name: getName(option.option_id)}); return acc }, [])

    // Sort high to low
    return data.sort((a, b) => b.votes - a.votes)
  },
  areVotesForPoll: (state, getters) => poll => {
    const voteCountByOption = getters.getVoteCountsByOption(poll)
    return voteCountByOption.some(o => o.totalVotes > 0)
  },
  getNumberOfUniqueVoters: (state, getters) => pollId => {
    const voterIds = Object.values(state.keyedById).filter(v => v.poll_id === pollId).map(v => v.user_id || v.hashed_user_id)
    return new Set(voterIds).size
  }
}
