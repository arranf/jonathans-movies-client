import tmdb from '@/api/tmdb'

export default {
  getFilmData ({commit}, option) {
    return tmdb.getMovieData(option.film.tmdb_id)
      .then(response => {
        commit('setOptionFilmData', {optionId: option._id, data: response.data})
      })
      .catch(error => console.error(error))
  }
}
