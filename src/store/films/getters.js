export default {
  getNominatedFilms (state, getters, rootState, rootGetters) {
    let currentPollOptions = rootGetters['option/getOptionsForCurrentPoll']
    return getters.find({query: {
      _id: {
        $in: currentPollOptions.map(option => option.film_id)
      }
    }})
  }
}
