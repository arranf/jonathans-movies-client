<template>
  <md-dialog :md-active.sync="show" @md-opened="modalOpened" @md-closed="modalClosed">
    <md-card v-if="film && film.data" v-show="shouldDisplay" v-images-loaded="imageRendered" >
      <md-card-media>
        <img :src="backdropImage" :alt="`{film.name} Backdrop`">
      </md-card-media>
      <md-card-header>
        <div class="md-title">{{film.name}}</div>
        <div class="md-subhead">
          {{getFilmYear}} <span class="font-weight-bold">Runtime</span>: {{film.data.runtime}} mins | <span class="font-weight-bold">Genres</span> {{film.genres.join(', ')}}
        </div>
      </md-card-header>
      <md-card-content>
        {{film.overview}}
      </md-card-content>
      <md-card-actions>
        <md-button @click="$emit('update:show', false)">Close</md-button>
        <md-button @click.prevent="addNomination()" v-if="showNominate && isCurrentPollInNomination" :disabled="!hasNominationsRemaining || this.isOptionForCurrentPoll(this.film._id)">
          {{ !this.isOptionForCurrentPoll(this.film._id) ? 'Nominate' : 'Nominated' }}
        </md-button>
        <md-button :href="getImdbLink" target="_blank" class="card-link float-right">
          <i class="fa fa-imdb fa-2x" aria-hidden="true"></i>
        </md-button>
      </md-card-actions>
    </md-card>
  </md-dialog>
</template>

<script>
import queries from '@/api'
import utils from '@/utils'
import tmdbApi from '@/api/tmdb'
import {mapGetters, mapActions} from 'vuex'
import imagesLoaded from 'vue-images-loaded'

export default {
  name: 'MovieInfoModal',
  props: {
    filmId: {type: String},
    showNominate: {default: true, type: Boolean},
    show: {type: Boolean}
  },
  data () {
    return {
      shouldDisplay: false,
      film: {}
    }
  },
  directives: {
    imagesLoaded
  },
  methods: {
    ...mapActions('films', {fetch: 'get'}),
    modalOpened: function () {
      this.film = this.getFromStore(this.filmId)
      if (!this.film) {
        console.error(`Error reading movie with id ${this.filmId}`)
        this.$router.push('/movies')
      } else if (this.film && !this.film.data) {
        tmdbApi.getMovieData(this.film.tmdb_id)
          .then(response => this.$set(this.film, 'data', response.data))
          .catch(error => { console.error(error); this.hideModal(this.this.film._id) })
      }
    },
    modalClosed: function () {
      this.$router.push('/movies')
    },
    addNomination: function () {
      if (this.showNominate && this.hasNominationsRemaining && !this.isOptionForCurrentPoll(this.film_id)) {
        queries.addNomination(this.film)
          .then(() => {
            utils.hideModal(this, this.film._id)
            if (!this.hasNominationsRemaining) {
              this.$router.push('/')
            }
          })
          .catch(error => console.error(error))
      }
    },
    imageRendered: function () { this.shouldDisplay = true }
  },
  computed: {
    ...mapGetters('option', ['hasNominationsRemaining', 'isOptionForCurrentPoll']),
    ...mapGetters('poll', ['isCurrentPollInNomination']),
    ...mapGetters('films', {getFromStore: 'get'}),
    backdropImage: function () {
      if (this.film.data) {
        return utils.getTmdbBackdropImage(this.film.data.backdrop_path)
      }
      return ''
    },
    getImdbLink: function () {
      if (this.film && this.film.data && this.film.data.imdb_id) { return `https://www.imdb.com/title/${this.film.data.imdb_id}` }
    },
    getFilmYear: function () {
      if (this.film && this.film.release_date) {
        return utils.getYearFromTmdbReleaseDate(this.film.release_date)
      }
    }
  },
  created () {
    if (this.show && this.filmId && !this.getFromStore(this.filmId)) {
      this.fetch(this.filmId)
        .then(a => {
          console.log(`Fetched movie with id ${this.filmId}`)
          this.modalOpened()
        })
    }
  }
}
</script>

<style scoped>
.fa-imdb {
  color: #FDD835;
}
</style>