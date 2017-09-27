export default {
  getNominatedFilms (state, getters, rootState, rootGetters) {
    let currentPollOptions = rootGetters['option/getOptionsForCurrentPoll']
    if (currentPollOptions.length > 0) {
      const nominatedFilms = getters.find({query: {
        _id: {
          $in: currentPollOptions.map(option => option.film_id)
        }
      }})
      return nominatedFilms.data
    } else {
      return []
    }
  }
}
