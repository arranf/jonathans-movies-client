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
            <div class="container fluid grid-list-xs">
            <div class="layout row wrap">
              <div class="flex xs6 sm4 md3 lg2" :key="recommendation.film._id+index" v-for="(recommendation, index) in recommendations">
                <film-preview :film="recommendation.film" :reasons="recommendation.reasons" modal-page-name="Discover"></film-preview>
              </div>
            </div>
          </div>
        </div>
        <div v-if="suggestions && suggestions.length">
          <h3 class="separator mt-4">Popular and Highly Rated Movies</h3>
          <div class="container grid-list-md text-xs-center">
            <div class="layout row wrap">
              <div class="flex xs6 md3 lg2" :key="film._id+index" v-for="(film, index) in suggestions">
                <film-preview :film="film" modal-page-name="Discover"></film-preview>
              </div>
              <quote v-if="done" />
              <div class="flex xs12">
                <progress-linear color="secondary" v-if="loading && isDelayElapsed" :indeterminate="true" />
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>

// eslint-disable-next-line
import lazySizes from 'lazysizes'
import FilmPreview from '@/components/common/FilmPreview'
import { getRecommendations as fetchRecommendations, discoverMovies } from '@/api'

import scrollListener from '@/scroll-listener'
import debounce from 'tiny-debounce'
import { mapActions } from 'vuex'
import Loading from '@/components/common/Loading'

const Quote = () => import('./Quote')
const MovieInfoModal = () => ({ component: import('@/components/common/MovieInfoModal'), delay: 200, loading: Loading })
const ProgressLinear = () => import('@/components/common/ProgressLinear')

export default {
  name: 'Discover',
  data () {
    return {
      showingFilm: false,
      isDelayElapsed: false,
      suggestions: [],
      recommendations: [],
      loading: false,
      seenIds: [],
      done: false
    }
  },
  components: {
    FilmPreview,
    MovieInfoModal,
    Quote,
    ProgressLinear
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
    refresh: debounce(function () {
      if (this.done || this.loading) {
        return
      }
      this.isDelayElapsed = false
      this.loading = true
      setTimeout(() => {
        this.isDelayElapsed = true
      }, 200)
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
          this.loading = false
        })
        .catch(e => {
          console.error(e)
          this.setSnackbar('Something went wrong. Try again.')
          this.loading = false
        })
    }, 250),
    getRecommendations: function () {
      this.loading = true
      return fetchRecommendations()
        .then(response => {
          this.recommendations = response
          this.loading = false
        })
        .catch(e => {
          console.error(e)
          this.setSnackbar('Something went wrong. Try again.')
          this.loading = false
        })
    },
    scroll () {
      window.scrollTo(0, 0)
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
