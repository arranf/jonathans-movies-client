import client from '@/api/feathers-client'

// Controls how often time is mutated
const interval = 1000
// Controls how many interval times before a server check for time is made
const maxCount = 6

const state = {
  now: new Date().getTime(),
  hasStarted: false,
  counter: 0
}

const actions = {
  start ({ dispatch, commit, state }) {
    if (!state.hasStarted) {
      return dispatch('setInitialTime').then(() => {
        commit('setStarted')
        setInterval(() => {
          commit('incrementCounter')
          if (state.counter === 0) {
            dispatch('setInitialTime').then(() => commit('incrementCounter'))
          } else {
            commit('updateTime')
          }
        }, interval)
      })
    }
  },
  setInitialTime ({ commit, state }) {
    return new Promise((resolve, reject) => {
      const timeService = client.service('time')
      timeService
        .find()
        .then(response => {
          commit('setTime', response)
          resolve()
        })
        .catch(error => reject(error))
    })
  }
}

const mutations = {
  updateTime (state) {
    state.now += interval
  },
  setStarted (state) {
    state.hasStarted = true
  },
  setTime (state, timeResponse) {
    state.now = timeResponse.time
  },
  incrementCounter (state) {
    if (state.counter === maxCount - 1) {
      state.counter = 0
    } else {
      state.counter++
    }
  }
}

const getters = {
  getNow (state) {
    return state.now
  }
}

const time = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
export default time
