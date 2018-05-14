// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// We use runtime-only to prevent use of eval

import Vue from 'vue'
import App from '@/components/skeleton/AppContainer'
import router from './router'
import store from './store/'
import '@/api/feathers-client'

import Vuetify from 'vuetify'
Vue.use(Vuetify)
require('vuetify/dist/vuetify.min.css')

// Import custom CSS
require('@/assets/styles/main.scss')

Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV !== 'production'
Vue.config.performance = process.env.NODE_ENV !== 'production'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
