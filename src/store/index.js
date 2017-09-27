import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import feathersClient from '@/api/feathers-client'

import voteGetters from '/vote/getters'
import optionGetters from '/option/getters'
import pollGetters from '/poll/getters'
import filmsGetters from '/films/getters'

import time from '@/store/time'

Vue.use(Vuex)

const { service, auth } = feathersVuex(feathersClient, { idField: '_id' })

const store = new Vuex.Store({
  modules: {
    time
  },
  plugins: [
    service('vote', {getters: voteGetters}),
    service('option', {getters: optionGetters}),
    service('poll', {getters: pollGetters}),
    service('films', {getters: filmsGetters}),
    service('users'),
    auth({userService: 'users'})
  ]
})

export default store
