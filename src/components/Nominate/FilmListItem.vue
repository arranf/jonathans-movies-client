<template>
  <md-list-item @click.prevent="showModal()">
      <div class="md-list-item-text">
        <span>{{film.name}} <small>{{getFilmYear}}</small></span>
        <span>{{film.genres.join(', ')}}</span>
      </div>

      <div class="md-list-action">
        <span class="md-primary">{{film.score}} <i class="fa fa-star text-md-accent" aria-disabled="true"></i></span>
      </div>
  </md-list-item>
</template>

<script>
import queries from '@/api'
import utils from '@/utils'
import {mapGetters} from 'vuex'

export default {
  name: 'FilmListItem',
  props: {
    film: {type: Object}
  },
  methods: {
    showModal: function () {
      this.$router.push({name: 'Movies', params: { filmId: this.film._id }})
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