import feathersClient from '@/api/feathers-client'

const state = {
  current: ''
}

const actions = {
  getCurrent ({ commit, state }) {
    feathersClient.service('/house').find()
      .then((data) => {
        commit('setCurrent', data)
      })
  },
  changeCurrent ({ commit, state }, payload) {
    feathersClient.service('/house').patch()
      .then((data) => {
        commit('setCurrent', data)
      })
  }
}

const mutations = {
  setCurrent (state, payload) {
    state.current = typeof payload === 'string' ? payload : payload.current
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
