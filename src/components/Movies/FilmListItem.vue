<template>
  <v-list-tile @click.prevent="showModal()">
      <v-list-tile-avatar>
        <v-avatar color="primary" :size="40">
          <span class="white--text headline">{{filmStart}}</span>
        </v-avatar>
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title v-text="film.name"></v-list-tile-title>
        <v-list-tile-sub-title v-html="getFilmYear"></v-list-tile-sub-title>
      </v-list-tile-content>
  </v-list-tile>
</template>

<script>
import { addNomination } from '@/api'
import { getYearFromTmdbReleaseDate } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'FilmListItem',
  props: {
    film: { type: Object }
  },
  methods: {
    showModal: function () {
      this.$router.push({ name: 'Movies', params: { filmId: this.film._id } })
    },
    addNomination: function () {
      addNomination(this.film)
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
        return getYearFromTmdbReleaseDate(this.film.release_date)
      }
      return ''
    },
    filmStart: function () {
      const code = this.film.name.charCodeAt(0)
      if (
        // !(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)
      ) {
        // lower alpha (a-z)
        return '#'
      }
      return this.film.name[0]
    }
  }
}
</script>
