<template>
   <div>
      <div v-if="allFilms" v-infinite-scroll="fetchNextPage()" :infinite-scroll-immediate-check="false" :infinite-scroll-disabled="busy" infinite-scroll-distance="10">
        <!-- <md-dialog :md-active.sync="showFilters">
          <div class="md-layout">
            
          </div>
        </md-dialog> -->

        <!-- <modal :pivotY="0.05" name="filterOptions" height="auto" width="85%" :scrollable="true" @before-open="beforeOpen" @opened="opened" >
          <div class="card">
            <form>
                <div class="card-body">
                  <div class="form-group row">
                    <label for="search" class="col-sm-2 col-form-label">Search</label>
                    <div class="col-sm-10">
                      <input v-model="searchTitle" class="form-control" id="search" placeholder="Double Dragon">
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <div @click.prevent="elements.genreFilters = !elements.genreFilters">{{elements.genreFilters ? 'Hide' : 'Show'}} Genre Filters <i class="fa" :class="[elements.genreFilters ? 'fa-chevron-right' : 'fa-chevron-down']"></i></div>
                  <div v-show="elements.genreFilters" class="row">
                    <template v-for="genre in totalGenres">
                      <div :key="genre.id" class="col-xs-3">
                        <button class="m-1 btn btn-sm" :class="{active: genres.indexOf(genre.name) > -1}" @click.prevent="changeGenre(genre.name)">
                          {{genre.name}}
                        </button>
                      </div>
                    </template>
                  </div>
                </div>
                <div class="card-body">
                <div @click.prevent="elements.ratingFilter = !elements.ratingFilter">{{elements.ratingFilter ? 'Hide' : 'Show'}} Rating Filter <i class="fa" :class="[elements.ratingFilter ? 'fa-chevron-right' : 'fa-chevron-down']"></i></div>
                  <div v-if="elements.ratingFilter" class="row">
                    <div class="col">
                      <vue-slider v-model="floorRating" :formatter="'Min. {value}'" :max="10" :min="0" :interval="0.1" />
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <button @click.prevent="requery" type="submit" class="btn btn-primary">Submit</button>
                  <button @click.prevent="reset" type="reset" class="btn btn-outline-secondary">Reset</button>
                </div>
            </form>
            </div>
        </modal> -->


        <movie-info-modal :show.sync="showingFilm" :filmId="$route.params.filmId" :show-nominate="true" />

        <md-list>
          <film-suggestion v-for="(film, index) in allFilms" :film="film" :key="index"/>
        </md-list>

        <md-progress-bar v-show="busy" class="md-accent" md-mode="indeterminate"></md-progress-bar>
      </div>  

      <md-button class="md-fab md-fab-bottom-right" @click="showFilters = true">
        <md-icon>filter</md-icon>
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
      floorRating: 0.0,
      elements: {
        genreFilters: false,
        ratingFilter: false
      }
    }
  },
  directives: {
    infiniteScroll
  },
  components: {
    FilmSuggestion,
    MovieInfoModal
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
    },
    changeGenre (genre) {
      const index = this.genres.indexOf(genre)
      if (index !== -1) {
        this.genres.splice(index, 1)
      } else {
        this.genres.push(genre)
      }
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
</style>