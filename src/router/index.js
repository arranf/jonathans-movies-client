import Vue from 'vue'
import Router from 'vue-router'
import ComingSoon from '@/components/ComingSoon'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'coming-soon',
      component: ComingSoon
    }
  ]
})
