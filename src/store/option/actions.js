import tmdb from '@/api/tmdb'

export default {
  getFilmData ({commit}, option) {
    return tmdb.getMovieData(option.film.tmdb_id)
    .then(response => {
      option.film.data = response.data
      commit('forceUpdateItem', option)
    })
    .catch(error => console.error(error))
  }
}
