import Vue from 'vue'

export default {
  forceUpdateItem (state, item) {
    const { idField } = state
    let id = item[idField]
    Vue.set(state.keyedById[id], '', item)
  }
}
