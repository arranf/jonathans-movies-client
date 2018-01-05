import Vue from 'vue'

export default {
  setFilmData (state, item) {
    let id = item.filmId
    Vue.set(state.keyedById[id], 'data', item.data)
  }
}
