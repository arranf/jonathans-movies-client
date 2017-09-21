import Vue from 'vue'
import Vuex from 'vuex'
import feathersClient from '@/api/feathers-client'
import feathersVuex from 'feathers-vuex'

import time from '@/store/time'

Vue.use(Vuex)

const { service, auth } = feathersVuex(feathersClient, { idField: '_id' })

const store = new Vuex.Store({
  modules: {
    time
  },
  plugins: [
    service('vote', {getters: {
      userVotes (state, getters, rootState, rootGetters) {
        const user = rootState.auth.user
        if (rootGetters['poll/isActivePoll'] && user) {
          return getters.find({query: {poll_id: rootGetters['poll/getActivePoll']._id, user_id: user._id}})
        }
        return null
      },
      votesRemaining (state, getters, rootState, rootGetters) {
        let activePoll = rootGetters['poll/getActivePoll']
        if (activePoll) {
          return activePoll.numberOfVotes - getters.userVotes.total
        }
        return null
      }
    }}),
    service('option'),
    service('poll', {getters: {
      getActivePoll (state, getters, rootState, rootGetters) {
        let currentDateTime = rootState.time.now
        return Object.values(state.keyedById)
              .sort((a, b) => a.endDateTime < a.endDateTime ? -1 : 1)
              .find(p => p.startDateTime <= currentDateTime && p.endDateTime > currentDateTime)
      },
      isActivePoll (state, getters, rootState, rootGetters) {
        let currentDateTime = rootState.time.now
        let polls = Object.values(state.keyedById)
        return polls.some(p => p.startDateTime <= currentDateTime && p.endDateTime > currentDateTime)
      }
    }}),
    service('users'),
    auth({userService: 'users'})
  ]
})

export default store
