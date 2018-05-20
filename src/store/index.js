import Vue from 'vue'
import Vuex from 'vuex'
import feathersClient from '../api/feathers-client'
import feathersVuex from 'feathers-vuex'

import voteGetters from './vote/getters'
import optionGetters from './option/getters'
import pollGetters from './poll/getters'
import filmsGetters from './films/getters'

import optionActions from './option/actions'
import filmActions from './films/actions'
import filmMutations from './films/mutations'

import time from '@/store/time'
import snackbar from '@/store/snackbar'

Vue.use(Vuex)
const { service, auth } = feathersVuex(feathersClient, { idField: '_id' })

let plugins = [service('vote', {getters: voteGetters}),
  service('option', {getters: optionGetters, actions: optionActions}),
  service('poll', {getters: pollGetters}),
  service('users'),
  service('films', {getters: filmsGetters, actions: filmActions, mutations: filmMutations}),
  auth({userService: 'users'})]

const store = new Vuex.Store({
  modules: {
    time,
    snackbar
  },
  plugins: [
    ...plugins
  ]
})

export default store
