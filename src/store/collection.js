import feathersClient from '@/api/feathers-client'

const state = {
  current: ''
}

const actions = {
  getCurrent ({ commit, state }) {
    feathersClient.service('/collection').find()
      .then((data) => {
        commit('setCurrent', data)
      })
  },
  changeCurrent ({ commit, rootGetters, dispatch }, payload) {
    const activePoll = rootGetters['poll/getActivePoll']
    if (activePoll) {
      dispatch('snackbar/setText', {
        text: 'A poll is active. Unable to change collections until the poll is complete.',
        isPersistent: false
      })
    } else {
      feathersClient.service('/collection').patch('fakeId', {})
        .then((data) => {
          commit('setCurrent', data)
        })
    }
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
