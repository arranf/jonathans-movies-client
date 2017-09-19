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
  console.group(to.fullPath)
  console.group('To')
  console.log(to)
  console.groupEnd()
  console.group('From')
  console.log(from)
  console.groupEnd()
  console.groupEnd()
  if (!store.state.auth.user && to.path !== '/') {
    console.log('Going to login')
    next('/')
  } else {
    next()
  }
})

export default router
