<template>
  <div @click="showModal()">
    <movie-info-modal :show.sync="show" :film="film" :show-nominate="true" />
    <md-card md-with-hover >
      <md-card-header>
        <div class="md-title">{{film.name}} <small>{{getFilmYear}}</small></div>
        <div class="md-subhead">{{film.score}} <i class="fa fa-star" aria-disabled="true"></i></div>
      </md-card-header>

      <md-card-content>
         {{film.genres.join(', ')}}
      </md-card-content>

      <md-card-actions>
        <md-button @click="showModal()">Details</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
import queries from '@/api'
import utils from '@/utils'
import {mapGetters} from 'vuex'

import MovieInfoModal from '@/components/common/MovieInfoModal'

export default {
  props: {
    film: {type: Object}
  },
  components: {
    MovieInfoModal
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    showModal: function () {
      this.show = true
    },
    hideModal: function () {
      this.hide = false
    },
    addNomination: function () {
      queries.addNomination(this.film)
        .then(() => {
          this.hideModal()
          if (!this.hasNominationsRemaining) {
            this.$router.push('/')
          }
        })
        .catch(error => console.error(error))
    }
  },
  computed: {
    ...mapGetters('option', ['hasNominationsRemaining']),
    getFilmYear: function () {
      if (this.film && this.film.release_date) {
        return utils.getYearFromTmdbReleaseDate(this.film.release_date)
      }
      return ''
    }
  }
}
</script>