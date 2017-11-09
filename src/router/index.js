import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home/Home'
import Login from '@/components/Login/Login'
import SignUp from '@/components/SignUp/SignUp'
import Create from '@/components/Create/Create'
import Nominate from '@/components/Nominate/Nominate'

import store from '@/store'
import feathersClient from '@/api/feathers-client'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
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
              next('/home')
            })
            .catch(function (error) {
              console.error('Error authenticating in login router beforeEnter', error)
            })
        }
        next()
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/create',
      name: 'Create',
      component: Create,
      meta: {
        admin: true
      }
    },
    {
      path: '/movies',
      name: 'Movies',
      component: Nominate
    }
  ]
})

router.beforeEach((to, from, next) => {
  const user = store.state.auth.user

  if (!user && to.path !== '/' && to.path !== '/signup') {
    // TODO Refactor into generic method
    store.dispatch('auth/authenticate')
      .then(response => {
        return feathersClient.passport.verifyJWT(response.accessToken)
      })
      .then(payload => {
        return feathersClient.service('users').get(payload.userId)
      })
      .then(() => {
        next()
      })
      .catch(function (error) {
        next('/')
        console.error('Error authenticating in router beforeEnter', error)
      })
  } else if (to.matched.some(record => record.meta.admin) && !user.isAdmin) {
    next(false)
  } else {
    next()
  }
})

export default router
