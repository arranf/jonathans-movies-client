import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import feathersClient from '@/api/feathers-client'

import voteGetters from './vote/getters'
import optionGetters from './option/getters'
import pollGetters from './poll/getters'
import filmsGetters from './films/getters'

import optionActions from './option/actions'
import optionMutations from './option/mutations'

import time from '@/store/time'
import errors from '@/store/errors'

Vue.use(Vuex)

const { service, auth } = feathersVuex(feathersClient, { idField: '_id' })

const store = new Vuex.Store({
  modules: {
    time,
    errors
  },
  plugins: [
    service('vote', {getters: voteGetters}),
    service('option', {getters: optionGetters, actions: optionActions, mutations: optionMutations}),
    service('poll', {getters: pollGetters}),
    service('users'),
    service('films', {getters: filmsGetters}),
    auth({userService: 'users'})
  ]
})

export default store
