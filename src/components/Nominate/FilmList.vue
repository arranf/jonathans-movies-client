<template>
   <div>
      <div v-if="allFilms" v-infinite-scroll="fetchNextPage()" :infinite-scroll-immediate-check="false" :infinite-scroll-disabled="busy" infinite-scroll-distance="10">
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

        <movie-info-modal @snackbar="setSnackbar" close-route="/movies" :show.sync="showingFilm" :filmId="filmId" :show-nominate="true" />

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

     <v-snackbar :bottom="true" id="snackbar" v-model="showSnackbar" >
        <span>{{snackbarText}}</span>
      <v-btn @click="showSnackbar = false">Close</v-btn>
    </v-snackbar>
   </div>
</template>

<script>
import FilmListItem from './FilmListItem'
import infiniteScroll from 'vue-infinite-scroll'
import {mapGetters, mapActions, mapMutations} from 'vuex'
// import VueSlider from 'vue-slider-component'
import debounce from 'lodash/debounce'
import constants from '@/constants'
import MovieInfoModal from '@/components/common/MovieInfoModal'

export default {
  name: 'FilmList',
  data: function () {
    return {
      showingFilm: false,
      showFilters: false,
      showSnackbar: false,
      snackbarText: '',
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
      this.busy = true
      this.queryFilms(this.query)
        .then(response => { this.total = response.total; this.busy = false; this.showSnackbar = false })
        .catch(error => {
          console.error(error)
          this.busy = false
          this.setSnackbar('No films can be displayed')
        })
    },
    setSnackbar (text) {
      this.showSnackbar = true
      this.snackbarText = text
    }
  },
  created () {
    // $route watcher will not be called when componenet loaded
    this.showingFilm = Boolean(this.filmId)
    this.clearFilms()
    this.getFilms()
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