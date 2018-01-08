<template>
  <md-dialog :md-active.sync="show" @md-opened="modalOpened" @md-closed="modalClosed">
    <md-card v-if="film" v-show="shouldDisplay" v-images-loaded="imageRendered"  >
      <md-card-media v-if="backdropImage">
        <img :src="backdropImage" :alt="`${film.name} Backdrop`">
      </md-card-media>
      <md-card-header>
        <div class="md-title w-100">
          {{film.name}} <small>({{getFilmYear}})</small> 
          <a v-if="getImdbLink" :href="getImdbLink" target="_blank" style="float: right;">
            <i class="fa fa-imdb" style="font-size:1.3em" aria-hidden="true"></i>
          </a>
        </div>
        <div v-if="film && film.tagline" class="md-subhead">
          {{film.tagline}}
        </div>
      </md-card-header>

      <md-card-content>
        <h3 class="md-subheading">Information</h3>
        <div>
          <div v-if="film.genres"><strong>Genres</strong>: {{film.genres.join(', ')}}</div>
          <div v-if="film.runtime"><strong>Runtime</strong>: {{film.runtime}} mins</div>
          <div v-if="film.last_watched"><strong>Last Watched</strong>: {{film.last_watched}}</div>
        </div>
      </md-card-content>

      <md-card-content class="d-inline-block" v-if="film.imdb_rating || film.rotten_tomatoes_rating">
        <h3 class="md-subheading">Ratings</h3>
        <div>
          <div v-if="film.imdb_rating"><strong>IMDB</strong>: {{film.imdb_rating}}</div>
          <div v-if="film.rotten_tomatoes_rating"><strong>Rotten Tomatoes</strong>: {{film.rotten_tomatoes_rating}}%
          </div>
        </div>
      </md-card-content>

          <md-card-expand-trigger>
            <md-button>
              <md-icon>keyboard_arrow_down</md-icon> Read Plot
            </md-button>
          </md-card-expand-trigger>
       <md-card-expand>
           <md-card-expand-content>
            <md-card-content>
              {{film.overview}}
            </md-card-content>
          </md-card-expand-content>
       </md-card-expand>

       <md-card-actions>
          <div>
            <md-button @click.prevent="addNomination()" v-if="nominatable">
              {{nominateButtonText}}
            </md-button>
            <md-button @click="$emit('update:show', false)">Close</md-button>
          </div>
        </md-card-actions>
    </md-card>
  </md-dialog>
</template>

<script>
import queries from '@/api'
import utils from '@/utils'
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
      this.film = this.get(this.filmId)
      if (!this.film) {
        this.fetch(this.filmId)
          .then(film => {
            this.film = film
          })
          .catch(error => { console.error(error); this.$emit('update:show', false) })
      }
    },
    modalClosed: function () {
      this.$router.go(-1)
    },
    addNomination: function () {
      if (this.showNominate && this.hasNominationsRemaining && !this.isOptionForCurrentPoll(this.film_id)) {
        queries.addNomination(this.film)
          .then(() => {
            this.$emit('update:show', false)
            if (!this.hasNominationsRemaining) {
              this.$router.push('/')
            } else {
              this.$emit('snackbar', `Nominated ${this.film.name}. You have ${this.nominationsRemaining} nomination${this.nominationsRemaining > 1 ? 's' : ''}  left`)
            }
          })
          .catch(error => console.error(error))
      }
    },
    imageRendered: function () { this.shouldDisplay = true }
  },
  computed: {
    ...mapGetters('option', ['hasNominationsRemaining', 'isOptionForCurrentPoll', 'nominationsRemaining']),
    ...mapGetters('poll', ['isCurrentPollInNomination']),
    ...mapGetters('films', ['get']),
    backdropImage: function () {
      if (this.film) {
        return utils.getTmdbBackdropImage(this.film.backdrop_path)
      }
      return ''
    },
    getImdbLink: function () {
      if (this.film && this.film.imdb_id) { return `https://www.imdb.com/title/${this.film.imdb_id}` }
    },
    getFilmYear: function () {
      if (this.film && this.film.release_date) {
        return utils.getYearFromTmdbReleaseDate(this.film.release_date)
      }
    },
    nominateButtonText () {
      if (this.isOptionForCurrentPoll(this.film._id)) {
        return 'Nominated'
      }
      return 'Nominate'
    },
    nominatable () {
      // Set to show nominations
      return this.showNominate &&
        this.isCurrentPollInNomination &&
        // user has a nomination to spend on it
        this.hasNominationsRemaining &&
        // isn't already nominated
        !this.isOptionForCurrentPoll(this.film._id)
    }
  },
  created () {
    if (this.filmId) {
      this.modalOpened()
    }
  }
}
</script>

<style scoped>
.fa-imdb {
  color: #FDD835;
}
</style>