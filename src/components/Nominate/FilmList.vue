<template>
   <div>
      <div v-if="allFilms" v-infinite-scroll="fetchNextPage()" :infinite-scroll-immediate-check="false" :infinite-scroll-disabled="busy" infinite-scroll-distance="10">
        <md-dialog :md-active.sync="showFilters" md-on>
          <md-content class="w-100">
            <div class="md-layout-row md-layout-wrap md-gutter m-4">
              <md-field>
                <label for="genres">Genres</label>
                <md-select v-model="genres" name="genres" id="genres" multiple>
                  <md-option v-for="option in totalGenres" :key="option.id" :value="option.name">{{option.name}}</md-option>
                </md-select>
              </md-field>
              <div class="pt-3 mt-1 mb-4">
                <label class="md-label" for="rating">Rating</label>
                <vue-slider class="px-0" name="rating" v-model="floorRating" :formatter="'Min. {value}'" :max="10" :min="0" :interval="0.1" />
              </div>
              <md-button @click.prevent="requery()" type="submit" class="md-accent md-raised">Submit</md-button>
              <md-button @click.prevent="reset()" type="reset">Reset</md-button>
            </div>
          </md-content>
        </md-dialog>

        <movie-info-modal :show.sync="showingFilm" :filmId="$route.params.filmId" :show-nominate="true" />

        <md-list>
          <film-suggestion v-for="(film, index) in allFilms" :film="film" :key="index"/>
        </md-list>

        <md-progress-bar v-show="busy" class="md-accent" md-mode="indeterminate"></md-progress-bar>
      </div>  

      <md-button class="md-fab md-fab-bottom-right" @click="showFilters = true">
        <md-icon>filter_list</md-icon>
      </md-button>

     <md-snackbar id="snackbar" md-position="center" :md-active.sync="showSnackbar" md-persistent>
      <span>Unable to fetch more films.</span>
      <md-button class="md-primary" @click="getFilms(); showSnackbar = false">Try Again</md-button>
    </md-snackbar>
   </div>
</template>

<script>
import FilmSuggestion from './FilmSuggestion'
import infiniteScroll from 'vue-infinite-scroll'
import {mapGetters, mapActions, mapMutations} from 'vuex'
import VueSlider from 'vue-slider-component'
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
      searchTitle: '',
      page: 0,
      limit: 50,
      loadedAll: false,
      busy: false,
      total: 51,
      sort: {name: 1},
      genres: [],
      floorRating: 0.0
    }
  },
  directives: {
    infiniteScroll
  },
  components: {
    FilmSuggestion,
    MovieInfoModal,
    VueSlider
  },
  watch: {
    '$route' (to, from) {
      this.showingFilm = Boolean(to.params.filmId)
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
      if (this.searchTitle) {
        query.query['$search'] = this.searchTitle
      }
      if (this.floorRating > 0) {
        query.query['score'] = {'$gte': this.floorRating}
      }
      return query
    }
  },
  methods: {
    ...mapActions('films', {queryFilms: 'find'}),
    ...mapMutations('films', {clearFilms: 'clearAll'}),
    reset: function () {
      this.page = 0
      this.searchTitle = ''
      this.genres = []
      this.total = 51
      this.floorRating = 0
      this.$modal.hide('filterOptions')
      this.getFilms()
    },
    requery: function () {
      this.$modal.hide('filterOptions')
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
        .catch(error => { console.error(error); this.busy = false; this.showSnackbar = true })
    }
  },
  created () {
    // $route watcher will not be called when componenet loaded
    this.showingFilm = Boolean(this.$route.params.filmId)
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