import client from '@/api/feathers-client'

const state = {
  now: new Date().getTime(),
  hasStarted: false
}

const actions = {
  start ({ dispatch, commit, state }) {
    if (!state.hasStarted) {
      return dispatch('setInitialTime').then(() => {
        commit('setStarted')
        setInterval(() => {
          commit('updateTime')
        }, 1000)
      })
    }
  },
  setInitialTime ({commit, state}) {
    return new Promise((resolve, reject) => {
      const timeService = client.service('time')
      timeService.find()
        .then(response => { commit('setInitialTime', response); resolve() })
        .catch(error => reject(error))
    })
  }
}

const mutations = {
  updateTime (state) {
    state.now += 1000
  },
  setStarted (state) {
    state.hasStarted = true
  },
  setInitialTime (state, timeResponse) {
    state.now = timeResponse.time
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
