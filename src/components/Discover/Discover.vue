<template>
  <div>
    <movie-info-modal @snackbar="setSnackbar" :show.sync="showingFilm" :filmId="$route.params.filmId" :show-nominate="true" />
    <div class="d-flex flex-column" v-if="suggestions" >

      <h2 class="md-display-1 text-center">Discover a Movie</h2>
      <div class="scroll align-self-center" v-infinite-scroll="refresh" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
        <template  v-for="film in suggestions">
          <film-preview class="scroll-item" :key="film._id" :film="film" modal-page-name="Discover"></film-preview>
        </template>
      </div>
    </div>

    <md-snackbar :md-active.sync="showSnackbar">
      <span>{{snackbarMessage}}</span>
      <md-button class="md-primary" @click="showSnackbar = false">Close</md-button>
    </md-snackbar>
  </div>
</template>

<script>
import infiniteScroll from 'vue-infinite-scroll'
import FilmPreview from '@/components/common/FilmPreview'
import MovieInfoModal from '@/components/common/MovieInfoModal'
import queries from '@/api'

export default {
  name: 'Suggestions',
  data () {
    return {
      showingFilm: false,
      suggestions: [],
      showSnackbar: false,
      snackbarMessage: ''
    }
  },
  components: {
    FilmPreview,
    MovieInfoModal
  },
  directives: {
    infiniteScroll
  },
  watch: {
    '$route' (to, from) {
      this.showingFilm = Boolean(to.params.filmId)
    }
  },
  methods: {
    setSnackbar (message) {
      this.snackbarMessage = message
      this.showSnackbar = true
    },
    refresh () {
      queries.discoverMovies()
        .then(discoveredFilms => { console.log(discoveredFilms); this.suggestions = discoveredFilms })
        .catch(e => {
          console.error(e)
          this.setSnackbar('Something went wrong. Try again.')
        })
    }
  },
  created () {
    // route watcher won't be called on initial load
    this.showingFilm = Boolean(this.$route.params.filmId)
    this.refresh()
  }
}
</script>

<style lang="scss">
.scroll {
  display: flex;
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
