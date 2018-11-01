<template>
   <div>
      <div v-if="allFilms"> 
        <!-- TODO: Move this out and make it emit update events and a filter event -->
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
              <v-spacer id="hide" />
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

      <v-btn class="big-bottom" right color="accent" fab fixed @click="showFilters = true">
        <v-icon>filter_list</v-icon>
      </v-btn>
   </div>
</template>

<script>
import {VProgressLinear, VIcon, VBtn, VList, VDivider, VSlider, VSelect, VDialog, VSubheader} from 'vuetify'
// import * as  from 'vuetify/es5/components/VList'
import * as VCard from 'vuetify/es5/components/VCard'

import FilmListItem from './FilmListItem'
import {mapGetters, mapActions, mapMutations} from 'vuex'
import debounce from 'lodash/debounce'
import constants from '@/constants'
import MovieInfoModal from '@/components/common/MovieInfoModal'

export default {
  name: 'FilmList',
  components: {
    ...VCard,
    VList,
    VSubheader,
    VSelect,
    VSlider,
    VDialog,
    VProgressLinear,
    VIcon,
    VBtn,
    VDivider,
    FilmListItem,
    MovieInfoModal
  },
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
      genres: [],
      reachedEnd: false
    }
  },
  props: {
    filmId: String
  },
  watch: {
    'filmId' (newFilmId, oldFilmId) {
      this.showingFilm = Boolean(newFilmId)
    }
  },
  computed: {
    ...mapGetters('films', {allFilms: 'list'}),
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
    getFilms: function () {
      let query = this.query
      return this.queryFilms(query)
        .then(response => { this.total = response.total; this.busy = false })
        .catch(error => {
          console.error(error)
          this.busy = false
          this.setSnackbar('No films can be displayed')
        })
    },
    tryFetchNextPage: function () {
      const offset = this.limit * this.page
      if (offset >= this.total) {
        this.reachedEnd = true
        return
      }
      this.busy = true
      return this.fetchNextPage()
    },
    fetchNextPage: debounce(function () {
      console.log('Calling next page on scroll')
      this.page++
      return this.getFilms()
    }, 800, {leading: true})
  },
  beforeDestroy () {
    document.removeEventListener('scroll', this.listener)
  },
  created () {
    // $route watcher will not be called when componenet loaded
    this.showingFilm = Boolean(this.filmId)
    let nextPage = this.tryFetchNextPage
    this.listener = function (event) {
      const docHeight = getDocHeight()
      const scrollXY = getScrollXY()
      // console.log(`Docheight ${docHeight}, scrollXY ${scrollXY}, window innerheight ${window.innerHeight}`)
      // <= prevents iOS overscroll bugs: https://stackoverflow.com/questions/11172917/jquery-detect-bottom-of-page-on-mobile-safari-ios
      if (docHeight <= (scrollXY[1] + window.innerHeight)) {
        nextPage()
      }
    }
    this.clearFilms()
    this.getFilms()
      .then(() => document.addEventListener('scroll', this.listener))
      // TODO: Add retry
      .catch((e) => console.error(e))

    // Scroll listener
    // https://jsfiddle.net/W75mP/
    // https://github.com/nuxt/nuxt.js/issues/2512
    function getScrollXY () {
      const scrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)
      const scrollLeft = Math.max(window.pageXOffset, document.body.scrollLeft, document.documentElement.scrollLeft)
      return [ scrollLeft, scrollTop ]
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
  }
}
</script>

<style scoped>
/* hide the space in modal on small screens */
@media (max-width:350px)  { 
  #hide {
    display: none;
  }
}
.big-bottom {
  bottom: 64px;
}
</style>