<template>
  <div class="card mt-3 mb-1 mx-2 movie-poster" v-if="option" >
    <img class="card-img-top" v-if="option.film && option.film.data" v-once :src="getFilmPoster" :alt="option.name + ' image'">
    <div class="card-body">
      <h4 class="card-title">{{option.name}} <small v-if="option.film && option.film.data">{{getFilmYear}}</small></h4>
      <p class="text-muted" v-if="option.film && option.film.data"><span class="font-weight-bold">Runtime</span>: {{option.film.data.runtime}} mins</p>
      <p class="text-muted"><span class="font-weight-bold">Genres</span> {{option.film.genres.join(', ')}}</p>
    </div>
    <div class="card-body" v-if="option.film && option.film.data">
      <a v-once :href="getImdbLink" target="_blank" class="card-link">More Information</a>
    </div>
  </div>
</template>

<script>
import utils from '@/utils'
import tmdb from '@/api/tmdb'

export default {
  name: 'OptionPreview',
  props: ['option'],
  computed: {
    lastWatched: function () {return utils.humanizeTimeToNowImprecise(this.option.film.lastWatched) + ' ago'},
    getFilmBackdrop: function () {return utils.getTmdbBackdropImage(this.option.film.data.backdrop_path)},
    getFilmPoster: function () {return utils.getTmdbPosterImage(this.option.film.data.poster_path)},
    getImdbLink: function () {
      return `https://www.imdb.com/title/${this.option.film.data.imdb_id}`
    },
    getFilmYear: function() {
      return utils.getYearFromTmdbReleaseDate(this.option.film.release_date)
    }
  },
  created() {
    if (this.option.film) {
      tmdb.getMovieData(this.option.film.tmdb_id)
      .then(response => {
        this.$set(this.option.film, 'data', response.data)
      })
      .catch(error => console.error(error))
    }
  }
}
</script>

<style>
  .movie-poster {
    width: 15rem !important;
  }
</style>
