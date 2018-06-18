// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// We use runtime-only to prevent use of eval

import Vue from 'vue'
import App from '@/components/skeleton/AppContainer'
import router from './router'
import store from './store/'
import '@/api/feathers-client'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

import {
  Vuetify, // required
  VApp, // required
  VGrid,
  VNavigationDrawer,
  VToolbar,
  transitions
} from 'vuetify'

import { Ripple } from 'vuetify/es5/directives'

Vue.use(Vuetify, {
  components: {
    VApp,
    VGrid,
    VNavigationDrawer,
    VToolbar,
    transitions
  },
  directives: {
    Ripple
  }
})

require('vuetify/src/stylus/app.styl')

// Import custom CSS
require('@/assets/styles/main.scss')

const isProduction = process.env.NODE_ENV === 'production'
Vue.config.productionTip = !isProduction
Vue.config.devtools = !isProduction
Vue.config.performance = !isProduction

if (isProduction) {
  Raven
    .config('https://5e5d7f63477a49289a3e7556f761afb7@sentry.io/221248')
    .addPlugin(RavenVue, Vue)
    .install()
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
