<template>
   <div v-if="allFilms" v-infinite-scroll="fetchNextPage" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="scroll">
     <modal :pivotY="0.05" name="filterOptions" height="auto" width="85%" :scrollable="true" @before-open="beforeOpen" @opened="opened" >
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
     </modal>
     <template v-for="(film, index) in allFilms">
      <film-suggestion class="m-1" :film="film" :key="index"/>
    </template>
    <loading-bounce v-show="busy" />
    <div class="fab" :class="[getActivePoll ? 'high-fab' : 'low-fab']">
      <a class="icon btn btn-lg btn-danger btn-circle" @click="displayFilterOptionsModal()">
        <i class="fa fa-search text-white" aria-disabled="true"></i>
      </a>
    </div>
  </div>  
</template>

<script>
import FilmSuggestion from './FilmSuggestion'
import VueSlider from 'vue-slider-component'
import infiniteScroll from 'vue-infinite-scroll'
import {mapGetters, mapActions, mapMutations} from 'vuex'
import LoadingBounce from '@/components/Loading/LoadingBounce'
import constants from '@/constants'

require('@/../node_modules/animate.css/animate.css')

export default {
  name: 'FilmSelector',
  data: function () {
    return {
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
    LoadingBounce
  },
  methods: {
    ...mapActions('films', {queryFilms: 'find'}),
    ...mapMutations('films', {clearFilms: 'clearAll'}),
    reset: function () {
      this.page = 0
      this.searchTitle = ''
      this.genres = []
      this.total = 51
    },
    requery: function () {
      this.$modal.hide('filterOptions')
      this.page = 0
      this.busy = true
      this.clearFilms()
      this.getFilms()
    },
    components: {
      FilmSuggestion,
      LoadingBounce,
      VueSlider
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
      fetchNextPage: function () {
        const offset = this.limit * this.page
        if (offset >= this.total) {
          return
        }
        this.page++
        this.getFilms()
      },
      displayFilterOptionsModal: function () {
        this.$modal.show('filterOptions')
      },
      getFilms: function () {
        this.busy = true
        this.queryFilms(this.query)
          .then(response => { this.total = response.total; this.busy = false })
          .catch(error => { console.error(error); this.busy = false })
      },
      changeGenre (genre) {
        const index = this.genres.indexOf(genre)
        if (index !== -1) {
          this.genres.splice(index, 1)
        } else {
          this.genres.push(genre)
        }
      },
      beforeOpen: () => { document.body.classList.remove('v--modal-block-scroll') },
      opened: () => { document.body.classList.add('v--modal-block-scroll') }
    },
    getFilms: function () {
      this.queryFilms(this.query)
        .then(response => { this.total = response.total; this.busy = false })
        .catch(error => { console.error(error); this.busy = false })
    },
    changeGenre (genre) {
      const index = this.genres.indexOf(genre)
      if (index !== -1) {
        this.genres.splice(index, 1)
      } else {
        this.genres.push(genre)
      }
    },
    beforeOpen: () => { document.body.classList.remove('v--modal-block-scroll') },
    opened: () => { document.body.classList.add('v--modal-block-scroll') }
  },
  created () {
    this.clearFilms()
    this.queryFilms(this.query)
  }
}
</script>


<style lang="scss" scoped>
  .scroll {
    overflow-y: scroll;
  }

  .icon:hover {
    -webkit-animation: bounce 0.7s;
    animation: bounce 0.7s;
  }

  .btn-circle {
    border-radius: 100%
  }

  .fab {
    position: absolute;
    z-index: 998;
  }

  .high-fab {
    bottom: 10em; right: 2em; 
  }

  .low-fab {
    bottom: 4.5em; right: 2em; 
  }

</style>