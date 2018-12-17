import Vue from 'vue'
import App from '@/components/skeleton/AppContainer'
import router from './router'
import store from './store/'
import '@/api/feathers-client'

import './plugins/vuetify'
import './registerServiceWorker'

// Import custom CSS
require('@/assets/styles/main.scss')

const isProduction = process.env.NODE_ENV === 'production'
Vue.config.productionTip = !isProduction
Vue.config.devtools = !isProduction
Vue.config.performance = !isProduction

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
