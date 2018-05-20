<template>
   <div>
      <div v-if="allFilms"> 
        <!-- TODO Move this out and make it emit update events and a filter event -->
        <v-dialog v-model="showFilters">
          <v-card>
            <v-card-title class="headline">Filter Movies</v-card-title>

            <v-subheader>Genres</v-subheader>
            <v-card-text class="pt-0 pb-0">
              <v-select :items="totalGenres" v-model="genres" multiple chips deletable-chips item-text="name" item-value="name" />
            </v-card-text>
            <v-subheader>Minimum Rating</v-subheader>
            <v-card-text class="pt-0 pb-0">
              <v-slider v-model="floorRating" thumb-label min="0" max="10" step="0.5" ticks></v-slider>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn flat @click.prevent="requery()" type="submit" class="md-accent md-raised">Submit</v-btn>
              <v-btn flat @click.prevent="reset()" type="reset">Reset</v-btn>
              <v-btn flat @click.prevent="showFilters = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <movie-info-modal close-route="/movies" :show.sync="showingFilm" :filmId="filmId" :show-nominate="true" />

        <v-list>
          <template v-for="(film, index) in allFilms">
            <film-list-item  :film="film" :key="film._id+'item'"/>
            <v-divider v-if="index + 1 < allFilms.length" :key="index"></v-divider>
          </template>
        </v-list> 

        <v-progress-linear v-show="busy" :indeterminate="true" />
      </div>  

      <v-btn right bottom color="accent" fab fixed @click="showFilters = true">
        <v-icon>filter_list</v-icon>
      </v-btn>
   </div>
</template>

<script>
import FilmListItem from './FilmListItem'
import infiniteScroll from 'vue-infinite-scroll'
import {mapGetters, mapActions, mapMutations} from 'vuex'
import debounce from 'lodash/debounce'
import constants from '@/constants'
import MovieInfoModal from '@/components/common/MovieInfoModal'

export default {
  name: 'FilmList',
  data: function () {
    return {
      showingFilm: false,
      showFilters: false,
      page: 0,
      limit: 50,
      loadedAll: false,
      busy: false,
      total: 51,
      sort: {name: 1},
      floorRating: 0.0,
      genres: []
    }
  },
  props: {
    filmId: String
  },
  directives: {
    infiniteScroll
  },
  components: {
    FilmListItem,
    MovieInfoModal
  },
  watch: {
    'filmId' (newFilmId, oldFilmId) {
      this.showingFilm = Boolean(newFilmId)
    }
  },
  computed: {
    ...mapGetters('films', {allFilms: 'list'}),
    ...mapGetters('poll', ['getActivePoll']),
    totalGenres: () => constants.genres,
    query: function () {
      let query = {query: {
        $limit: this.limit,
        $sort: this.sort,
        $skip: this.limit * this.page
      }}
      if (this.genres.length > 0) {
        query.query['genres'] = this.genres
      }
      if (this.floorRating > 0) {
        query.query['imdb_rating'] = {'$gte': this.floorRating}
      }
      return query
    }
  },
  methods: {
    ...mapActions('films', {queryFilms: 'find'}),
    ...mapMutations('films', {clearFilms: 'clearAll'}),
    ...mapActions('snackbar', {setSnackbar: 'setText'}),
    reset: function () {
      this.page = 0
      this.genres = ''
      this.total = 51
      this.floorRating = 0
      this.showFilters = false
      this.clearFilms()
      this.getFilms()
    },
    requery: function () {
      this.showFilters = false
      this.page = 0
      this.clearFilms()
      this.getFilms()
    },
    fetchNextPage: debounce(function () {
      const offset = this.limit * this.page
      if (offset >= this.total) {
        return
      }
      this.page++
      this.getFilms()
    }, 500, {leading: false}),
    getFilms: function () {
      this.queryFilms(this.query)
        .then(response => { this.total = response.total; this.busy = false })
        .catch(error => {
          console.error(error)
          this.busy = false
          this.setSnackbar('No films can be displayed')
        })
    },
    setBusy () {
      this.busy = true
    }
  },
  beforeDestroy () {
    document.removeEventListener('scroll', this.listener)
  },
  created () {
    // $route watcher will not be called when componenet loaded
    this.showingFilm = Boolean(this.filmId)
    this.clearFilms()
    this.getFilms()

    // Scroll listener
    // https://jsfiddle.net/W75mP/
    function getScrollXY () {
      let scrOfX = 0
      let scrOfY = 0
      if (typeof (window.pageYOffset) === 'number') {
        // Netscape compliant
        scrOfY = window.pageYOffset
        scrOfX = window.pageXOffset
      } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
        // DOM compliant
        scrOfY = document.body.scrollTop
        scrOfX = document.body.scrollLeft
      } else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
        // IE6 standards compliant mode
        scrOfY = document.documentElement.scrollTop
        scrOfX = document.documentElement.scrollLeft
      }
      return [ scrOfX, scrOfY ]
    }

    // taken from http://james.padolsey.com/javascript/get-document-height-cross-browser/
    function getDocHeight () {
      var D = document
      return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
      )
    }
    let setBusy = this.setBusy
    let nextPage = this.fetchNextPage
    this.listener = function (event) {
      if (getDocHeight() === getScrollXY()[1] + window.innerHeight) {
        setBusy()
        nextPage()
      }
    }
    document.addEventListener('scroll', this.listener)
  }
}
</script>


<style lang="scss" scoped>
  .md-fab {
    position: fixed !important;
    z-index: 3;
  }

  .md-label {
    font-size: 16px;
    line-height: 20px;
    color: rgba(0,0,0,0.54);
  }
</style>