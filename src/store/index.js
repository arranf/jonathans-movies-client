import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import feathersClient from '@/api/feathers-client'

import voteGetters from './vote/getters'
import optionGetters from './option/getters'
import pollGetters from './poll/getters'
import filmsGetters from './films/getters'

import time from '@/store/time'
import errors from '@/store/errors'
<<<<<<< HEAD
import utils from '@/utils'
=======
>>>>>>> feature-movie-suggest

Vue.use(Vuex)

const { service, auth } = feathersVuex(feathersClient, { idField: '_id' })

const store = new Vuex.Store({
  modules: {
    time,
    errors
  },
  plugins: [
    service('vote', {getters: voteGetters}),
    service('option', {getters: optionGetters}),
    service('poll', {getters: pollGetters}),
<<<<<<< HEAD
    service('films', {getters: filmsGetters}),
=======
>>>>>>> feature-movie-suggest
    service('users'),
    service('films', {getters: filmsGetters}),
    auth({userService: 'users'})
  ]
})

export default store
