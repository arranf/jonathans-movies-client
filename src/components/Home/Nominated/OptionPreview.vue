<template>
<div style="width: 15rem !important;">
  <div class="mt-2 mb-1 mx-2" style="width: 12rem;"  v-if="option" >
    <img class="img-fluid img-thumbnail" v-if="option.film && option.film.data" v-once :src="getFilmPoster" :alt="option.name + ' image'">
    <div v-else class="d-flex" style="height: 17.5rem;" :style="{backgroundColor: getColor()}">
      <div class="h-30 w-100 align-self-end">
        <p style="font-size: 1.6em;" class="text-white text-center">{{option.name}}</p>
      </div>
    </div>
  </div>
  <h6 class="text-muted ml-3">
    {{option.name}}
  </h6>
</div>
</template>

<script>
import utils from '@/utils'
import tmdb from '@/api/tmdb'
import constants from '@/constants'

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
  methods: {
    getColor: function () {
      return utils.selectRandom(constants.colors['800'])
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
