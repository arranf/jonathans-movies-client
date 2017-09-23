import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'

import groupBy from 'lodash/groupBy'
import loMap from 'lodash/map'

import feathersClient from '@/api/feathers-client'
import time from '@/store/time'
import utils from '@/utils'

Vue.use(Vuex)

const { service, auth } = feathersVuex(feathersClient, { idField: '_id' })

const store = new Vuex.Store({
  modules: {
    time
  },
  plugins: [
    service('vote', {getters: {
      userVotes: (state, getters, rootState, rootGetters) => {
        const user = rootState.auth.user
        if (rootGetters['poll/getActivePoll'] && user) {
          return getters.find({query: {poll_id: rootGetters['poll/getActivePoll']._id, user_id: user._id}})
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
    }}),
    service('option', {getters: {
      getOptionsForPoll: (state, getters) => (pollId) => {
        return getters.find({query: {
          poll_id: pollId
        }}).data
      },
      getOptionsForCurrentPoll: (state, getters, rootState, rootGetters) => {
        const activePoll = rootGetters['poll/getActivePoll']
        if (activePoll) {
          return getters.getOptionsForPoll(activePoll._id)
        }
      }
    }}),
    service('poll', {getters: {
      getActivePoll (state, getters, rootState, rootGetters) {
        let currentDateTime = rootState.time.now
        return Object.values(state.keyedById)
          // If a.eDT < b.eDT, a comes before b (orders first finishing first)
          .sort((a, b) => a.endDateTime < b.endDateTime ? -1 : 1)
          .find(p => p.startDateTime <= currentDateTime && p.endDateTime > currentDateTime)
      },
      isActivePoll (state, getters, rootState, rootGetters) {
        let currentDateTime = rootState.time.now
        let polls = Object.values(state.keyedById)
        return polls.some(p => p.startDateTime <= currentDateTime && p.endDateTime > currentDateTime)
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
        if (getters.isActivePoll) {
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
    }}),
    service('users'),
    auth({userService: 'users'})
  ]
})

export default store
