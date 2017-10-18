<template>
<div>
  <movie-info-modal v-if="option.film" :film="option.film" :show-nominate="true"></movie-info-modal>

  <div style="width: 15rem !important;" @click="showModal()">
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
</div>
</template>

<script>
import utils from '@/utils'
import constants from '@/constants'
import {mapState, mapActions} from 'vuex'
import MovieInfoModal from '@/components/MovieInfoModal'

export default {
  name: 'OptionPreview',
  props: ['option'],
  components: {
    MovieInfoModal
  },
  computed: {
    ...mapState('option', {waitingForOptionFind: 'isFindPending'}),
    lastWatched: function () {
      if (this.option.film && this.option.film.lastWatched){
        return utils.humanizeTimeToNowImprecise(this.option.film.lastWatched) + ' ago'
      }
      return null
    },
    getFilmBackdrop: function () {
      if (this.option.film && this.option.film.data && this.option.film.backdrop_path) {
        return utils.getTmdbBackdropImage(this.option.film.data.backdrop_path)
      }
      return null
    },
    getFilmPoster: function () {
      if (this.option.film && this.option.film.data) {
        return utils.getTmdbPosterImage(this.option.film.data.poster_path)
      }
      return null
    },
    getImdbLink: function () {
      if (this.option.film && this.option.film.data && this.option.film.data.imdb_id) {
        return `https://www.imdb.com/title/${this.option.film.data.imdb_id}`
      }
    },
    getFilmYear: function() {
      if (this.option.film && this.option.film.release_date) {
        return utils.getYearFromTmdbReleaseDate(this.option.film.release_date)
      }
      return null
    }
  },
  methods: {
    ...mapActions('option', ['getFilmData']),
    getColor: function () {
      return utils.selectRandom(constants.colors['800'])
    },
    showModal: function() {
      utils.showModal(this, this.option.film._id)
    }
  },
  data () {
    return {
      fetchedData: false
    }
  },
  created() {
    if (this.option.film ) {
      this.getFilmData(this.option)
    }
  }
}
</script>
