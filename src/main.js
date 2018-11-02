import Vue from 'vue'
import App from '@/components/skeleton/AppContainer'
import router from './router'
import store from './store/'
import '@/api/feathers-client'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

import './plugins/vuetify'
import "./registerServiceWorker";

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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");