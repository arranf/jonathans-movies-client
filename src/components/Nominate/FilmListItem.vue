<template>
  <v-list-tile @click.prevent="showModal()">
      <v-list-tile-content>
        <v-list-tile-title v-text="film.name"></v-list-tile-title>
        <v-list-tile-sub-title v-html="getFilmYear"></v-list-tile-sub-title>
      </v-list-tile-content>
  </v-list-tile>
</template>

<script>
// import * as VList from 'vuetify/es5/components/VList'
import queries from '@/api'
import utils from '@/utils'
import {mapGetters} from 'vuex'

export default {
  name: 'FilmListItem',
  // components: {
  //   ...VList
  // },
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