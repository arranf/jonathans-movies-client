<template>
  <div>
    <movie-info-modal close-route="/discover" :show.sync="showingFilm" :filmId="filmId" :show-nominate="true" />
    <!-- <h2 class="text-center">Discover a Movie</h2> -->
    <transition name="slide">
      <v-btn v-if="showUp > 1"
            fixed
            fab
            bottom
            right
            color="secondary"
            @click="scroll"
          >
        <span class="icon-expand_less"></span>
      </v-btn>
    </transition>

    <div v-infinite-scroll="refresh" :infinite-scroll-disabled="busy" :infinite-scroll-immediate-check="true" infinite-scroll-distance="40">
       
        <div v-if="recommendations && recommendations.length">
            <h3 class="separator">Recommended For You</h3>
            <v-container fluid grid-list-xs>
            <v-layout row wrap>
              <v-flex xs6 sm4 md3 lg2 :key="recommendation.film._id+index" v-for="(recommendation, index) in recommendations">
                <film-preview :film="recommendation.film" :reasons="recommendation.reasons" modal-page-name="Discover"></film-preview>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
        <div v-if="suggestions && suggestions.length">
          <h3 class="separator mt-4">Popular and Highly Rated Movies</h3>
          <v-container  grid-list-md text-xs-center>
            <v-layout row wrap>
              <v-flex xs6 md3 lg2 :key="film._id+index" v-for="(film, index) in suggestions">
                <film-preview :film="film" modal-page-name="Discover"></film-preview>
              </v-flex>
              <v-flex xs12>
                <v-progress-linear color="secondary" v-if="busy" indeterminate />
              </v-flex>
            </v-layout>
          </v-container>
        </div>
        <div v-else class="text-center"> 
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
    </div>
  </div>
</template>

<script>
import FilmPreview from '@/components/common/FilmPreview'
import MovieInfoModal from '@/components/common/MovieInfoModal'
import queries from '@/api'
import infiniteScroll from 'vue-infinite-scroll'
import { mapActions } from 'vuex'

export default {
  name: 'Suggestions',
  data () {
    return {
      showingFilm: false,
      suggestions: [],
      recommendations: [],
      busy: false,
      showUp: 0
    }
  },
  directives: {
    infiniteScroll
  },
  components: {
    FilmPreview,
    MovieInfoModal
  },
  props: {
    filmId: String
  },
  watch: {
    'filmId' (to, from) {
      this.showingFilm = Boolean(this.filmId)
    }
  },
  methods: {
    ...mapActions('snackbar', {setSnackbar: 'setText'}),
    refresh: function () {
      this.showUp++
      this.busy = true
      queries.discoverMovies()
        .then(discoveredFilms => { this.suggestions = this.suggestions.concat(discoveredFilms); this.busy = false })
        .catch(e => {
          console.error(e)
          this.setSnackbar('Something went wrong. Try again.')
          this.busy = false
        })
    },
    getRecommendations: function () {
      this.busy = true
      return queries.getRecommendations()
        .then(response => { this.recommendations = response; this.busy = false })
        .catch(e => {
          console.error(e)
          this.setSnackbar('Something went wrong. Try again.')
          this.busy = false
        })
    },
    scroll () {
      window.scrollTo(0, 0)
    }
  },
  created () {
    // route watcher won't be called on initial load
    this.showingFilm = Boolean(this.filmId)
    this.getRecommendations()
      .then(() => this.refresh())
      .catch((e) => console.error(e))
  }
}
</script>

<style scoped>
.separator {
  text-align: left;
  /* font-size: 140%; */
  border-bottom: #1A237E 2px solid;
  margin-bottom: 0.5em;
  font-weight: 600;
  font-size: 130%;
  color: #111;
}

.slide-enter { transform: translateY(100%) }
.slide-enter-to { transform: translateY(0) }

.slide-leave { transform: translateY(0) }
.slide-leave-to { transform: translateY(-100%) }

.slide-enter-active,
.slide-leave-active { transition: all 300ms ease-in }
</style>
