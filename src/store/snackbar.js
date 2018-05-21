const state = {
  text: '',
  isPersistent: false
}

const actions = {
  setText ({ commit, state }, payload) {
    commit('setSnack', payload)
  }
}

const mutations = {
  setSnack (state, payload) {
    if (typeof payload === 'string') {
      state.text = payload
      state.isPersistent = false
    } else {
      state.text = payload.text
      state.isPersistent = payload.isPersistent
    }
  },
  setNotPersistent (state) {
    state.isPersistent = false
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
