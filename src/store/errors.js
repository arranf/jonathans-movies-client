const state = {
  lastExceededVoteDateTime: 0
}

const actions = {
  updateLastExceededVoteDateTime ({commit, rootGetters}) {
    return new Promise((resolve, reject) => {
      const time = rootGetters['time/getNow']
      commit('setLastExceededVoteDateTime', time)
      resolve()
    })
  }
}

const mutations = {
  setLastExceededVoteDateTime (state, time) {
    state.lastExceededVoteDateTime = time
  }
}

const getters = {
  getLastExceededVoteDateTime (state) {
    return state.lastExceededVoteDateTime
  },
  shouldShowErrorForExceedVote (state, getters, rootState, rootGetters) {
    return state.lastExceededVoteDateTime >= rootGetters['time/getNow'] - 1500
  }
}

const errors = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
export default errors
