import Vue from 'vue'
import Vuex from 'vuex'
import feathersClient from '@/api/feathers-client'
import feathersVuex from 'feathers-vuex'

Vue.use(Vuex)

const { service, auth } = feathersVuex(feathersClient, { idField: '_id' })

const store = new Vuex.Store({
  plugins: [
    service('vote'),
    service('option'),
    service('poll', {getters: {
      getActivePoll (state) {
        console.log(state)
        let currentDateTime = new Date().getTime()
        return Object.values(state.keyedById)
              .sort((a, b) => a.endDateTime < a.endDateTime ? -1 : 1)
              .find(p => p.endDateTime > currentDateTime)
      },
      isActivePoll (state) {
        console.log(state)
        let currentDateTime = new Date().getTime()
        let polls = Object.values(state.keyedById)
        return polls.some(p => p.startDateTime <= currentDateTime && p.endDateTime > currentDateTime)
      }
    }}),
    service('users'),
    auth({userService: 'users'})
  ]
})

export default store
