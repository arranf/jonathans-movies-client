<template>
  <div v-if="film">
    <div class="card bg-dark text-white h-10">
      <img class="card-img" :src="getFilmBackdrop" alt="Card image">
      <div class="card-img-overlay">
        <h4 class="card-title">{{film.name}}</h4>
        <p class="card-text">Last Watched {{lastWatched}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '@/utils'
import tmdb from '@/api/tmdb'
import LazyLoad from 'lazyload'

export default {
  name: 'OptionPreview',
  props: ['film'],
  computed: {
    lastWatched: function () {return utils.humanizeTimeToNowImprecise(this.film.lastWatched) + ' ago'},
    getFilmBackdrop: function () {return utils.gettmdbBackdropImage(this.film.data.backdrop_path)}
  },
  created() {
    let lazyLoad = new LazyLoad()

    tmdb.getMovieData(this.film.tmdbId)
    .then(response => {
      this.film.data = response.data
    })
    .catch(error => console.error(error))
    
  },
  mounted() {
  }
}
</script>