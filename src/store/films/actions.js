import tmdb from '@/api/tmdb'

export default {
  getFilmData ({commit}, film) {
    return tmdb.getMovieData(film.tmdb_id)
      .then(response => {
        commit('setFilmData', {filmId: film._id, data: response.data})
      })
  }
}
