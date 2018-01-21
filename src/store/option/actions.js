import tmdb from '@/api/tmdb'

export default {
  getFilmDataForOption ({commit, dispatch, rootGetters}, option) {
    if (option.film_id) {
      let film = rootGetters['films/get'](option.film_id)
      let promise
      if (this.film) {
        promise = Promise.resolve()
      } else {
        promise = dispatch('films/get', option.film_id, {root: true})
      }

      return promise
        .then((f) => {
          film = f
          return tmdb.getMovieData(film.tmdb_id)
        })
        .then(response => {
          commit('films/setFilmData', {filmId: film._id, data: response.data}, {root: true})
        })
    }
    return Promise.reject(new Error('Option does not have a film'))
  }
}
