<template>
   <div>
      <div v-if="allFilms" v-infinite-scroll="fetchNextPage()" :infinite-scroll-immediate-check="false" :infinite-scroll-disabled="busy" infinite-scroll-distance="10">
        <!-- TODO Move this out and make it emit update events and a filter event -->
        <md-dialog :md-active.sync="showFilters" md-on>
          <md-content class="w-100">
            <div class="md-layout-row md-layout-wrap md-gutter m-4">
              <md-field>
                <label for="genres">Genre</label>
                <md-select v-model="genres" name="genres" id="genres">
                  <md-option v-for="option in totalGenres" v-once :key="'genre-'+option.id" :value="option.name">{{option.name}}</md-option>
                </md-select>
              </md-field>
              <div class="pt-3 mt-1 mb-4">
                <label class="md-label" for="rating">Minimum Rating</label>
                <vue-slider class="px-0" name="rating" height="1" v-model="floorRating" :max="10" :min="0" :interval="0.5" />
              </div>
              <md-button @click.prevent="requery()" type="submit" class="md-accent md-raised">Submit</md-button>
              <md-button @click.prevent="reset()" type="reset">Reset</md-button>
              <md-button @click.prevent="showFilters = false">Close</md-button>
            </div>
          </md-content>
        </md-dialog>

        <movie-info-modal @snackbar="setSnackbar" :show.sync="showingFilm" :filmId="$route.params.filmId" :show-nominate="true" />

        <md-list>
          <template v-for="film in allFilms">
            <film-list-item  :film="film" :key="film._id+'item'"/>
          </template>
        </md-list>

        <md-progress-bar v-show="busy" class="md-accent" md-mode="indeterminate"></md-progress-bar>
      </div>  

      <md-button class="md-fab md-fab-bottom-right" @click="showFilters = true">
        <md-icon>filter_list</md-icon>
      </md-button>

     <md-snackbar id="snackbar" md-position="center" :md-active.sync="showSnackbar" md-persistent>
        <span>{{snackbarText}}</span>
      <md-button class="md-primary" @click="showSnackbar = false">Close</md-button>
    </md-snackbar>
   </div>
</template>

<script>
import FilmListItem from './FilmListItem'
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
      snackbarText: '',
      page: 0,
      limit: 50,
      loadedAll: false,
      busy: false,
      total: 51,
      sort: {name: 1},
      genres: '',
      floorRating: 0.0
    }
  },
  directives: {
    infiniteScroll
  },
  components: {
    FilmListItem,
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
      if (this.genres) {
        query.query['genres'] = [this.genres]
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