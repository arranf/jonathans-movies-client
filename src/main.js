// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueModal from 'vue-js-modal'
import App from './AppContainer'
import router from './router'
import store from './store/'
import '@/api/feathers-client'

import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

// Import assets
require('font-awesome-webpack2')
require('styles/main.scss')
require('../node_modules/material-design-lite/material.min.js')

if (process.env.NODE_ENV === 'production' && process.env.BRANCH !== 'develop') {
  Raven
    .config('https://5e5d7f63477a49289a3e7556f761afb7@sentry.io/221248')
    .addPlugin(RavenVue, Vue)
    .install()
}

Vue.config.productionTip = false

Vue.use(VueModal)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
