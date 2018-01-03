<template>
  <modal :pivotY="0.05" :name="`${film._id}-modal`" height="auto" width="85%" @before-open="beforeOpen" @opened="modalOpened()" :scrollable="true">
    <md-card v-show="film.data && shouldDisplay" v-images-loaded="imageRendered">
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
        <md-button>Action</md-button>
        <md-button @click.prevent="addNomination()" v-if="showNominate && isCurrentPollInNomination" :disabled="!hasNominationsRemaining || this.isOptionForCurrentPoll(this.film._id)">
          {{ !this.isOptionForCurrentPoll(this.film._id) ? 'Nominate' : 'Nominated' }}
        </md-button>
        <md-button :href="getImdbLink" target="_blank" class="card-link float-right">
          <i class="fa fa-imdb fa-2x" aria-hidden="true"></i>
        </md-button>
      </md-card-actions>
    </md-card>
    <md-progress-spinner v-show="!film.data || !shouldDisplay" class="md-accent" md-mode="indeterminate" />
    
  </modal>
</template>

<script>
import queries from '@/api'
import utils from '@/utils'
import tmdbApi from '@/api/tmdb'
import {mapGetters} from 'vuex'
import imagesLoaded from 'vue-images-loaded'
import LoadingBounce from '@/components/common/LoadingBounce'

export default {
  name: 'MovieInfoModal',
  props: {
    film: {type: Object},
    showNominate: {default: true, type: Boolean}
  },
  data () {
    return {
      shouldDisplay: false
    }
  },
  directives: {
    imagesLoaded
  },
  components: {
    LoadingBounce
  },
  methods: {
    modalOpened: function () {
      document.body.classList.add('v--modal-block-scroll')
      if (!this.film.data) {
        tmdbApi.getMovieData(this.film.tmdb_id)
          .then(response => this.$set(this.film, 'data', response.data))
          .catch(error => { console.error(error); this.hideModal(this.this.film._id) })
      }
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
    imageRendered: function () { this.shouldDisplay = true },
    beforeOpen: function () { document.body.classList.remove('v--modal-block-scroll') }
  },
  computed: {
    ...mapGetters('option', ['hasNominationsRemaining', 'hasNominationsRemaining', 'isOptionForCurrentPoll']),
    ...mapGetters('poll', ['isCurrentPollInNomination']),
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
  }
}
</script>

<style scoped>
.fa-imdb {
  color: #FDD835;
}
</style>