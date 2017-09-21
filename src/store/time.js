const state = {
  now: new Date().getTime(),
  hasStarted: false
}

const actions = {
  start ({ commit, state }) {
    if (!state.hasStarted) {
      commit('setStarted')
      setInterval(() => {
        commit('updateTime')
      }, 1000)
    }
  }
}

const mutations = {
  updateTime (state) {
    state.now = new Date().getTime()
  },
  setStarted (state) {
    state.hasStarted = true
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
