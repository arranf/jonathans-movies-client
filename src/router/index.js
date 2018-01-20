import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import feathersClient from '@/api/feathers-client'

const Home = () => import('@/components/Home/Home')
const Login = () => import('@/components/Login/Login')
const SignUp = () => import('@/components/SignUp/SignUp')
const Create = () => import('@/components/Create/Create')
const Nominate = () => import('@/components/Nominate/Nominate')
const Add = () => import('@/components/Add/AddMovie')
const Discover = () => import('@/components/Discover/Discover')

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
      path: '/home/:filmId?',
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
      path: '/movies/:filmId?',
      name: 'Movies',
      component: Nominate
    },
    {
      path: '/add',
      name: 'Add',
      component: Add
    },
    {
      path: '/discover/:filmId?',
      name: 'Discover',
      component: Discover,
      props: true
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
