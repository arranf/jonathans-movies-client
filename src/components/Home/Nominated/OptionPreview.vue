<template>
  <div @click="showModal()" class="d-flex flex-column align-items-center" v-if="option" >
    <img class="img-fluid img-thumbnail" v-if="film" :src="getFilmPoster" :alt="option.name + ' image'">
    <div v-else class="d-flex flex-column justify-content-center fake-movie-poster" :style="{backgroundColor: getColor()}">
      <div class="h-30 w-100 align-self-end">
        <p style="font-size: 1.6em;" class="text-white text-center">{{option.name}}</p>
      </div>
    </div>
    <h4 class="md-subheading text-center">
      {{option.name}}
    </h4>
  </div>
</template>

<script>
import utils from '@/utils'
import constants from '@/constants'
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'OptionPreview',
  props: {
    option: {type: Object, required: true},
    showInfo: {type: Boolean, default: true}
  },
  computed: {
    ...mapGetters('films', {getFilm: 'get'}),
    lastWatched: function () {
      if (this.film && this.film.lastWatched) {
        return utils.humanizeTimeToNowImprecise(this.film.lastWatched) + ' ago'
      }
      return null
    },
    getFilmPoster: function () {
      if (this.film && this.film.poster_path) {
        return utils.getTmdbPosterImage(this.film.poster_path)
      }
      return ''
    },
    film () {
      if (this.option.film && this.option.film_id) {
        return this.getFilm(this.option.film_id)
      }
      return null
    }
  },
  methods: {
    ...mapActions('films', {fetchFilm: 'get'}),
    getColor: function () {
      return utils.selectRandom(constants.colors['800'])
    },
    showModal: function () {
      if (this.film && this.showInfo) {
        this.$router.push({name: 'Home', params: { filmId: this.film._id }})
      }
    }
  },
  created () {
    if (!this.film) {
      this.fetchFilm(this.option.film_id)
    }
  }
}
</script>