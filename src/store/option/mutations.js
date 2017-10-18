import Vue from 'vue'

export default {
  setOptionFilmData (state, item) {
    let id = item.optionId
    Vue.set(state.keyedById[id].film, 'data', item.data)
  }
}
