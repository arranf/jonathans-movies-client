<template>
  <div>
    <movie-info-modal @snackbar="setSnackbar" close-route="/discover" :show.sync="showingFilm" :filmId="filmId" :show-nominate="true" />
    
    <div v-infinite-scroll="refresh" infinite-scroll-disabled="busy" :infinite-scroll-immediate-check="true" infinite-scroll-distance="40">
      <h2 class="text-center">Discover a Movie</h2>
        <v-container v-if="suggestions && suggestions.length" grid-list-md text-xs-center>
          <v-layout row wrap>
            <v-flex xs6 :key="film._id+index" v-for="(film, index) in suggestions">
              <film-preview :film="film" modal-page-name="Discover"></film-preview>
            </v-flex>
            <v-flex xs12>
              <v-progress-linear color="secondary" v-if="busy" indeterminate />
            </v-flex>
          </v-layout>
        </v-container>
        <div v-else class="text-center"> 
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
    </div>

    <v-snackbar v-model="showSnackbar" :bottom="true">
      <span>{{snackbarMessage}}</span>
      <v-btn color="primary" @click="showSnackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import FilmPreview from '@/components/common/FilmPreview'
import MovieInfoModal from '@/components/common/MovieInfoModal'
import queries from '@/api'
import infiniteScroll from 'vue-infinite-scroll'
import debounce from 'lodash/debounce'

export default {
  name: 'Suggestions',
  data () {
    return {
      showingFilm: false,
      suggestions: [],
      showSnackbar: false,
      snackbarMessage: '',
      busy: false
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
    setSnackbar (message) {
      this.snackbarMessage = message
      this.showSnackbar = true
    },
    refresh: function () {
      console.log('Refreshing')
      this.busy = true
      queries.discoverMovies()
        .then(discoveredFilms => { this.suggestions = this.suggestions.concat(discoveredFilms); this.busy = false })
        .catch(e => {
          console.error(e)
          this.setSnackbar('Something went wrong. Try again.')
          this.busy = false
        })
    }
  },
  created () {
    // route watcher won't be called on initial load
    this.showingFilm = Boolean(this.filmId)
    this.refresh()
  }
}
</script>

<style lang="scss">
.scroll {
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  overflow-y: hidden;
  // white-space: nowrap;
  flex-wrap: nowrap;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
}

.scroll-item {
  flex: 0 0 auto;
  // display: inline-block;
}
</style>
