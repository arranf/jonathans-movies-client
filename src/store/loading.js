const state = {
  loading: {
    isAddLoading: false,
    isCollectionLoading: false,
    isCreateLoading: false,
    isHomeLoading: false,
    isMoviesLoading: false,
    isResultsLoading: false,
    isSignupLoading: false,
    isDiscoverLoading: false,
    isVerifyLoading: false,
  },
};

const actions = {
  setLoading({ commit }, payload) {
    commit("setLoading", payload);
  },
  setLoaded({ commit }, payload) {
    commit("setLoaded", payload);
  },
};

const mutations = {
  setLoading(state, payload) {
    const key = `is${payload}Loading`;
    state.loading[key] = true;
  },
  setLoaded(state, payload) {
    const key = `is${payload}Loading`;
    state.loading[key] = false;
  },
};

const getters = {
  isLoading: (state) => {
    let result = Object.values(state.loading).some((l) => l === true);
    return result;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
