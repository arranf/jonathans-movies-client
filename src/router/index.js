import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home/Home'
import Login from '@/components/Login/Login'
import store from '@/store'
import feathersClient from '@/api/feathers-client'

Vue.use(Router)

export default new Router({
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
          next({path: '/home'})
        } else {
          feathersClient.passport.getJWT()
            .then(token => store.dispatch('auth/authenticate', token))
            .then(response => {
              return feathersClient.passport.verifyJWT(response.accessToken)
            })
            .then(payload => {
              return feathersClient.service('users').get(payload.userId)
            })
            .then(
                next('/home')
            )
            .catch(function (error) {
              console.error('Error authenticating in login router beforeEnter', error)
            })
        }
        next()
      }
    }
  ]
})
