import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home/Home'
import Login from '@/components/Login/Login'
import store from '@/store'
import feathersClient from '@/api/feathers-client'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/',
      name: 'Login',
      component: Login,
      beforeEnter: (to, from, next) => {
        if (store.state.auth.user) {
          next('/home')
        } else {
          store.dispatch('auth/authenticate')
            .then(response => {
              return feathersClient.passport.verifyJWT(response.accessToken)
            })
            .then(payload => {
              return feathersClient.service('users').get(payload.userId)
            })
            .then(() => {
              console.log(store.state.auth.user)
              next('/home')
            })
            .catch(function (error) {
              console.error('Error authenticating in login router beforeEnter', error)
            })
        }
        next()
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const user = store.state.auth.user

  if (!user && to.path !== '/') {
    next('/')
  } else if (to.matched.some(record => record.meta.admin) && !user.isAdmin) {
    next(false)
  } else {
    next()
  }
})

export default router
