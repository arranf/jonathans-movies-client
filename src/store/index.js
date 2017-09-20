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
    service('poll'),
    service('users'),
    auth({userService: 'users'})
  ]
})

export default store
