<template>
  <div v-if="option">
    <div class="card mt-3 mb-1"  v-if="option" >
      <img class="card-img-top" v-if="option.film.data" v-once :src="getFilmBackdrop" :alt="option.name + ' image'">
      <div class="card-body">
        <h4 class="card-title mb-0">{{option.name}}</h4>
        <p class="card-text" v-if="lastWatched"><small class="text-muted">Last Watched {{lastWatched}}</small></p>
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
  props: ['option'],
  computed: {
    lastWatched: function () {return utils.humanizeTimeToNowImprecise(this.option.film.lastWatched) + ' ago'},
    getFilmBackdrop: function () {return utils.getTmdbBackdropImage(this.option.film.data.backdrop_path)}
  },
  created() {
    // let lazyLoad = new LazyLoad()

    tmdb.getMovieData(this.option.film.tmdbId)
    .then(response => {
      this.option.film.data = response.data
    })
    .catch(error => console.error(error))
    
  }
}
</script>