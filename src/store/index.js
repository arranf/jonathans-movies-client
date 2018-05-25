import Vue from 'vue'
import Vuex from 'vuex'

import feathersClient from '../api/feathers-client'
import feathersVuex from 'feathers-vuex'

import usersOnlineGetters from './users-online/getters'
import voteGetters from './vote/getters'
import optionGetters from './option/getters'
import pollGetters from './poll/getters'

import time from '@/store/time'
import snackbar from '@/store/snackbar'

const { service, auth, FeathersVuex } = feathersVuex(feathersClient, { idField: '_id' })
Vue.use(FeathersVuex)
Vue.use(Vuex)

let plugins = [
  service('vote', {getters: voteGetters}),
  service('option', {getters: optionGetters}),
  service('poll', {getters: pollGetters}),
  service('users'),
  service('films'),
  service('users-online', {getters: usersOnlineGetters}),
  auth({userService: 'users'})
]

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
