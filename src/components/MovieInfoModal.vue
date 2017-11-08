<template>
  <modal :pivotY="0.05" :name="`${film._id}-modal`" height="auto" width="85%" @before-open="beforeOpen" @opened="modalOpened()" :scrollable="true">
      <div class="card" v-show="film.data && shouldDisplay" v-images-loaded="imageRendered">
        <img class="card-img-top" :src="backdropImage" :alt="`{film.name} Backdrop`">
        <div class="card-body">
          <h4 class="card-title d-inline-block">{{film.name}} <small>{{getFilmYear}}</small></h4> <a v-if="film" :href="getImdbLink" target="_blank" class="card-link float-right"><i class="fa fa-imdb fa-2x" aria-hidden="true"></i></a>
          <p v-if="film.data" class="text-muted"><span class="font-weight-bold">Runtime</span>: {{film.data.runtime}} mins | <span class="font-weight-bold">Genres</span> {{film.genres.join(', ')}}</p>
          <p class="card-text">{{film.overview}}</p>
        </div>
        <div class="card-body mb-2" v-if="showNominate && isCurrentPollInNomination && hasNominationsRemaining" >
          <a href="#" @click="addNomination()" :class="shouldNominate" class="card-link font-weight-bold link-primary">{{ !this.isOptionForCurrentPoll(this.film._id) ? 'Nominate' : 'Nominated' }}</a>
        </div>
      </div>
      <loading-bounce v-show="!film.data || !shouldDisplay"></loading-bounce>
    </modal>
</template>

<script>
import queries from '@/api'
import utils from '@/utils'
import tmdbApi from '@/api/tmdb'
import {mapGetters} from 'vuex'
import imagesLoaded from 'vue-images-loaded'
import LoadingBounce from '@/components/Loading/LoadingBounce'

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
    },
    shouldNominate: function () {
      return {
        'text-muted': !this.hasNominationsRemaining || this.isOptionForCurrentPoll(this.film._id),
        'not-active': !this.hasNominationsRemaining || this.isOptionForCurrentPoll(this.film._id)
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