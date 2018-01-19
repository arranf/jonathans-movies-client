// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// We use runtime-only to prevent use of eval

import Vue from 'vue'
import App from '@/components/skeleton/AppContainer'
import router from './router'
import store from './store/'
import '@/api/feathers-client'

import VApp from 'vuetify/es5/components/VApp'

import Vuetify from 'vuetify/es5/components/Vuetify'
import VSnackbar from 'vuetify/es5/components/VSnackbar'
import VGrid from 'vuetify/es5/components/VGrid'
import VBtn from 'vuetify/es5/components/VBtn'
import VNavigationDrawer from 'vuetify/es5/components/VNavigationDrawer'
import transitions from 'vuetify/es5/components/transitions'
import { Ripple } from 'vuetify/es5/directives/'

Vue.use(Vuetify, {
  components: {
    VApp,
    VGrid,
    VSnackbar,
    VBtn,
    VNavigationDrawer,
    transitions
  },
  directives: {
    Ripple
  }
})

require('vuetify/src/stylus/app.styl')
// end vuetify

// Import custom CSS
require('@/assets/styles/main.scss')

// TODO replace with icomoon
require('font-awesome-webpack2')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
