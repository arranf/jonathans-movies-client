<template>
   <div v-if="allFilms" v-infinite-scroll="fetchNextPage" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="scroll">
     <modal :pivotY="0.05" name="filterOptions" height="auto" width="85%" :scrollable="true">
       <div class="card">
         <form>
            <div class="card-body">
              <div class="form-group row">
                <label for="search" class="col-sm-2 col-form-label">Search</label>
                <div class="col-sm-10">
                  <input class="form-control" id="search" placeholder="Double Dragon">
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
              <button @click.prevent="requery()" type="submit" class="btn btn-primary">Submit</button>
              <button type="reset" class="btn btn-outline-secondary">Reset</button>
            </div>
         </form>
        </div>
     </modal>
     <template v-for="(film, index) in allFilms">
      <film-suggestion class="m-1" :film="film" :key="index"/>
    </template>
    <loading-bounce v-show="busy" />
    <div style="bottom: 4.5em; right: 2em; position: absolute;">
      <a class="icon btn btn-lg btn-danger btn-circle" @click="displayFilterOptionsModal()">
        <i class="fa fa-plus text-white" aria-disabled="true"></i>
      </a>
    </div>
  </div>  
</template>

<script>
import FilmSuggestion from './FilmSuggestion'
import infiniteScroll from 'vue-infinite-scroll'
import {mapGetters, mapActions, mapMutations} from 'vuex'
import queries from '@/api'
import LoadingBounce from '@/components/Loading/LoadingBounce'
import constants from '@/constants'

require('@/../node_modules/animate.css/animate.css')

  export default {
    name: 'FilmSelector',
    data: function () {
      return {
        page: 0,
        limit: 50,
        loadedAll: false,
        busy: false,
        total: 51,
        sort: {name: 1},
        genres: [],
        elements: {
          genreFilters: true
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
    computed: {
      ...mapGetters('films', {queryLocalFilms: 'find', allFilms: 'list'}),
      totalGenres: () => constants.genres,
      query: function () {
        let query = {query: {
          $limit: this.limit,
          $sort: this.sort,
          $skip: this.limit * this.page,
        }}
        if (this.genres.length > 0){
          query.query['genres'] = this.genres
        }
        return query
      }
    },
    methods: {
      ...mapActions('films', {queryFilms: 'find'}),
      ...mapMutations('films', {clearFilms: 'clearAll'}),
      fetchNextPage: function () {
        const offset = this.limit * this.page
        if (offset >= this.total){
          return
        }
        this.busy = true
        this.page++
        this.getFilms()
      },
      displayFilterOptionsModal: function () {
        this.$modal.show('filterOptions')
      },
      getFilms: function (){
        this.queryFilms(this.query)
            .then(response => {this.total = response.total; this.busy = false})
            .catch(error => {console.error(error); this.busy = false})
      },
      requery: function () {
        this.$modal.hide('filterOptions')
        this.page = 0
        this.busy = true
        this.clearFilms()
        this.getFilms()
      },
      changeGenre(genre) {
        const index = this.genres.indexOf(genre) 
        if (index !== -1){
          this.genres.splice(index, 1)
        } else {
          this.genres.push(genre)
        }
      }
    },
    created() {
      this.queryFilms(this.query)
    }
  }
</script>


<style lang="scss" scoped>
  .scroll {
    overflow-y: scroll;
  }

  .icon:hover {
    -webkit-animation: bounce 0.5s;
    animation: bounce 0.5s;
  }

  .btn-circle {
    border-radius: 100%
  }

  input[type="checkbox"] {
    // position: absolute;
    opacity: 0;
    & + label {
        display: block;
        padding: .4em .8em;
        line-height: 1.5;
        color: #fff;
        background-color: #444;
        &:hover, &:focus, &:active {
            background-color: #DDE3ED;
            color:  #333;
        }
    }
    &:checked + label {
        background-color: #DDE3ED;
        color:  #333;
        &:hover, &:focus, &:active { background-color: #eee; }
    } 
}

</style>