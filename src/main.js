// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/components/skeleton/AppContainer'
import router from './router'
import store from './store/'
import '@/api/feathers-client'

// import Raven from 'raven-js'
// import RavenVue from 'raven-js/plugins/vue'

import { MdDivider, MdEmptyState, MdDialog, MdCheckbox, MdCard, MdMenu, MdAutocomplete, MdButton, MdField, MdProgress, MdHighlightText, MdList, MdIcon, MdDrawer, MdApp, MdContent, MdToolbar, MdSnackbar, MdChips, MdSwitch } from 'vue-material/dist/components'

Vue.use(MdList)
Vue.use(MdIcon)
Vue.use(MdDrawer)
Vue.use(MdField)
Vue.use(MdButton)
Vue.use(MdDrawer)
Vue.use(MdApp)
Vue.use(MdContent)
Vue.use(MdToolbar)
Vue.use(MdSnackbar)
Vue.use(MdChips)
Vue.use(MdSwitch)
Vue.use(MdAutocomplete)
Vue.use(MdMenu)
Vue.use(MdProgress)
Vue.use(MdHighlightText)
Vue.use(MdCard)
Vue.use(MdDialog)
Vue.use(MdCheckbox)
Vue.use(MdEmptyState)
Vue.use(MdDivider)

// Import assets
require('vue-material/dist/vue-material.min.css')
require('vue-material/dist/theme/default.css')
require('@/assets/styles/main.scss')

require('font-awesome-webpack2')

// if (process.env.NODE_ENV === 'production' && process.env.BRANCH && process.env.BRANCH !== 'develop') {
//   Raven
//     .config('https://5e5d7f63477a49289a3e7556f761afb7@sentry.io/221248')
//     .addPlugin(RavenVue, Vue)
//     .install()
// }

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
