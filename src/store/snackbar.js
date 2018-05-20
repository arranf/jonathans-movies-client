const state = {
  text: ''
}

const actions = {
  setText ({ commit, state }, text) {
    commit('setSnack', text)
  }
}

const mutations = {
  setSnack (state, snackText) {
    state.text = snackText
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
