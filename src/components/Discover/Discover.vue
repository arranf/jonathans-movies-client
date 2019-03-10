<template>
  <div>
    <movie-info-modal close-route="/discover" :show.sync="showingFilm" :filmId="filmId" :show-nominate="true" />
    <transition name="slide">
      <v-btn v-if="seenIds.length > 24"
            fixed
            fab
            bottom
            right
            color="secondary"
            @click="scroll"
            class="big-bottom"
          >
        <v-icon>expand_less</v-icon>
      </v-btn>
    </transition>

        <div v-if="recommendations && recommendations.length">
            <h3 class="separator">Recommended For You</h3>
            <v-container fluid grid-list-xs>
            <v-layout row wrap>
              <v-flex xs6 sm4 md3 lg2 :key="recommendation.film._id+index+'recommended'" v-for="(recommendation, index) in recommendations">
                <film-preview :film="recommendation.film" :reasons="recommendation.reasons" modal-page-name="Discover"></film-preview>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
        <div v-if="recentlyAdded && recentlyAdded.length">
          <h3 class="separator">Recently Added</h3>
              <v-container fluid grid-list-xs>
              <v-layout row wrap>
                <v-flex xs6 sm4 md3 lg2 :key="recentlyAdded._id+index+'recent'" v-for="(recentlyAdded, index) in recentlyAdded">
                  <film-preview :film="recentlyAdded" modal-page-name="Discover"></film-preview>
                </v-flex>
              </v-layout>
            </v-container>
        </div>
        <div v-if="suggestions && suggestions.length">
          <h3 class="separator mt-4">Popular and Highly Rated Movies</h3>
          <v-container grid-list-md text-xs-center>
            <v-layout row wrap>
              <v-flex xs6 md3 lg2 :key="film._id+index" v-for="(film, index) in suggestions">
                <film-preview :film="film" modal-page-name="Discover"></film-preview>
              </v-flex>
              <quote v-if="done" />
              <v-flex xs12>
                <v-progress-linear color="secondary" v-if="busy" indeterminate />
              </v-flex>
            </v-layout>
          </v-container>
        </div>
    </div>
</template>

<script>
import FilmPreview from '@/components/common/FilmPreview'
import MovieInfoModal from '@/components/common/MovieInfoModal'
import Quote from './Quote'
import { getRecommendations as fetchRecommendations, getRecentlyAdded as fetchRecentlyAdded, discoverMovies } from '@/api'

import scrollListener from '@/scroll-listener'
import { mapActions } from 'vuex'

export default {
  name: 'Suggestions',
  data () {
    return {
      showingFilm: false,
      suggestions: [],
      recommendations: [],
      recentlyAdded: [],
      busy: false,
      seenIds: [],
      done: false
    }
  },
  components: {
    FilmPreview,
    MovieInfoModal,
    Quote
  },
  props: {
    filmId: String
  },
  watch: {
    filmId (to, from) {
      this.showingFilm = Boolean(this.filmId)
    }
  },
  methods: {
    ...mapActions('snackbar', { setSnackbar: 'setText' }),
    ...mapActions('loading', ['setLoaded']),
    refresh: function () {
      if (this.done) {
        return
      }
      this.busy = true
      return discoverMovies(this.seenIds)
        .then(discoveredFilms => {
          // Check if we've exhausted the collection
          if (discoveredFilms.length === 0) {
            this.done = true
          }

          this.suggestions = this.suggestions.concat(discoveredFilms)
          for (let i = 0; i < discoveredFilms.length; i++) {
            this.seenIds.push(discoveredFilms[i]._id)
          }
          this.busy = false
        })
        .catch(e => {
          console.error(e)
          this.setSnackbar('Something went wrong. Try again.')
          this.busy = false
        })
    },
    getRecommendations: function () {
      this.busy = true
      return fetchRecommendations()
        .then(response => {
          this.recommendations = response
          this.busy = false
        })
        .catch(e => {
          console.error(e)
          this.setSnackbar('Something went wrong. Try again.')
          this.busy = false
        })
    },
    getRecentlyAdded: function () {
      this.busy = true
      return fetchRecentlyAdded()
        .then(response => {
          this.recentlyAdded = response.data || response
          this.busy = false
        })
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
  computed: {
    disabled () {
      return this.busy || this.done
    }
  },
  beforeDestroy () {
    document.removeEventListener('scroll', this.listener)
  },
  async created () {
    const nextPage = this.refresh
    this.listener = scrollListener(nextPage)
    // route watcher won't be called on initial load
    this.showingFilm = Boolean(this.filmId)
    try {
      await this.getRecommendations()
      await this.getRecentlyAdded()
      await this.refresh()
      document.addEventListener('scroll', this.listener)
      await this.setLoaded('Discover')
    } catch (e) {
      document.removeEventListener('scroll', this.listener)
      console.error(e)
    }
  }
}
</script>

<style scoped>
.separator {
  text-align: left;
  /* font-size: 140%; */
  border-bottom: #1a237e 2px solid;
  margin-bottom: 0.5em;
  font-weight: 600;
  font-size: 130%;
  color: #111;
}

.slide-enter {
  transform: translateY(100%);
}
.slide-enter-to {
  transform: translateY(0);
}

.slide-leave {
  transform: translateY(0);
}
.slide-leave-to {
  transform: translateY(-100%);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 300ms ease-in;
}

.big-bottom {
  bottom: 64px;
}
</style>
