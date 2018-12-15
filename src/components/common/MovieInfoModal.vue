<template>
<v-layout row justify-center>
  <v-dialog v-model="show" lazy fullscreen transition="dialog-bottom-transition" :overlay="false">
    <v-card v-if="film"  >
      <movie-bg :height="30" :film="film" />
      <v-card-title primary-title>
        <div>
          <h1 class="headline mb-0">{{film.name}} <small>({{getFilmYear}})</small></h1>
          <a v-if="film.imdbLink" :href="film.imdbLink" target="_blank" style="float: right;">
            <svg id="imdb">
              <use xlink:href="/fa-brands.svg#imdb"></use>
            </svg>
          </a>
          <h3 class="subtitle grey--text text--darken-2">{{film.tagline}}</h3>
        </div>
      </v-card-title>

      <v-card-text>
        <v-container grid-list-md text-xs-left>
          <v-layout row wrap>
            <v-flex xs6>
              <h3 class="md-subheading">Information</h3>
              <div>
                <div v-if="film.genres && film.genres.length"><strong>Genres</strong>: {{film.genres.join(', ')}}</div>
                <div v-if="film.runtime"><strong>Runtime</strong>: {{film.runtime}} mins</div>
                <div v-if="film.last_watched"><strong>Last Watched</strong>: {{film.last_watched}}</div>
              </div>
            </v-flex>
            <v-flex xs6>
              <h3 class="md-subheading">Ratings</h3>
              <div>
                <div v-if="film.imdb_rating"><strong>IMDB</strong>: {{film.imdb_rating}}</div>
                <div v-if="film.rotten_tomatoes_rating"><strong>Rotten Tomatoes</strong>: {{film.rotten_tomatoes_rating}}%
                </div>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-slide-y-transition>
        <v-card-text v-if="showOverview">
                {{film.overview}}
        </v-card-text>
      </v-slide-y-transition>

       <v-card-actions>
         <v-spacer></v-spacer>
        <v-btn flat color="primary" @click.prevent="addNomination()" v-if="inNominations" :disabled="!nominatable">
          {{nominateButtonText}}
        </v-btn>
        <v-btn flat @click="showOverview = !showOverview">
          <v-icon>{{!showOverview ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}}</v-icon> Read Plot
        </v-btn>
        <v-btn flat @click="closeModal()">Close</v-btn>
        </v-card-actions>
    </v-card>
    <loading v-else />
   </v-dialog>
  </v-layout>
</template>

<script>
import { addNomination } from '@/api'
import { getYearFromTmdbReleaseDate } from '@/utils'
import { mapGetters, mapActions } from 'vuex'
import MovieBg from './MovieBg'
import Loading from '@/components/skeleton/Loading'

export default {
  name: 'MovieInfoModal',
  components: {
    MovieBg,
    Loading
  },
  props: {
    filmId: { type: String },
    showNominate: { default: true, type: Boolean },
    show: { type: Boolean },
    closeRoute: { type: String, required: true }
  },
  data () {
    return {
      shouldDisplay: false || !this.backdropImage,
      film: {},
      showOverview: false
    }
  },
  methods: {
    ...mapActions('films', { fetchFilm: 'get' }),
    ...mapActions('snackbar', { setSnackbar: 'setText' }),
    modalOpened: function () {
      this.showOverview = false
      // Use internal getter
      this.film = this.getFilm(this.filmId)

      // Someone has hit the page fresh
      if (!this.film) {
        // Fetch from API
        this.fetchFilm(this.filmId)
          .then(film => {
            this.film = film
          })
          .catch(error => {
            console.error(error)
            this.setSnackbar("Sorry! Couldn't find that film.")
            this.$emit('update:show', false)
          })
      }
    },
    closeModal: function () {
      this.$emit('update:show', false)
      this.$router.replace(this.closeRoute)
    },
    addNomination: function () {
      if (
        this.showNominate &&
        this.hasNominationsRemaining &&
        !this.isOptionForCurrentPoll(this.film_id)
      ) {
        // Copied to prevent a weird race condition
        const amountRemaining = JSON.parse(JSON.stringify(this.nominationsRemaining))
        addNomination(this.film)
          .then(() => {
            this.$emit('update:show', false)
            if (amountRemaining === 1) {
              this.$router.push('/')
            } else {
              this.setSnackbar(
                `Nominated. You have ${amountRemaining - 1} nomination${
                  this.nominationsRemaining === 1 ? '' : 's'
                } left`
              )
            }
          })
          .catch(e => {
            console.error(e)
            this.setSnackbar(e.message ? e.message : e)
          })
      } else {
        this.setSnackbar('Error adding nomination.')
      }
    }
  },
  computed: {
    ...mapGetters('option', [
      'hasNominationsRemaining',
      'isOptionForCurrentPoll',
      'nominationsRemaining'
    ]),
    ...mapGetters('poll', ['isCurrentPollInNomination']),
    ...mapGetters('films', { getFilm: 'get' }),
    getFilmYear: function () {
      if (this.film && this.film.release_date) {
        return getYearFromTmdbReleaseDate(this.film.release_date)
      }
    },
    nominateButtonText () {
      if (this.isOptionForCurrentPoll(this.film._id)) {
        return 'Nominated'
      }
      return 'Nominate'
    },
    inNominations () {
      // Set to show nominations
      return this.showNominate && this.isCurrentPollInNomination
    },
    nominatable () {
      // user has left to spend and isn't already nominated
      return (
        this.hasNominationsRemaining &&
        !this.isOptionForCurrentPoll(this.film._id)
      )
    }
  },
  created () {
    if (this.filmId) {
      this.modalOpened()
    }
  },
  watch: {
    filmId: function (newFilmId, oldFilmId) {
      if (newFilmId) {
        this.modalOpened()
      }
    }
  }
}
</script>

<style scoped>
#imdb {
  fill: #fdd835;
  height: 2.5em;
  width: 2.5em;
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3D(0, 0, 0);
  will-change: opacity, margin-top;
  transition-property: opacity, margin-top;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
