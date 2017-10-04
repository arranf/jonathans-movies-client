<template>
   <div v-if="allFilms" v-infinite-scroll="fetchNextPage" infinite-scroll-disabled="busy" infinite-scroll-distance="15">
     <template v-for="film in allFilms">
      <film-suggestion class="m-2" :key="film._id" :film="film">
      </film-suggestion>
    </template>
  </div>
</template>

<script>
import FilmSuggestion from './FilmSuggestion'
import infiniteScroll from 'vue-infinite-scroll'
import {mapGetters} from 'vuex'
import queries from '@/api'

  export default {
    name: 'FilmSelector',
    data () {
      return {
        page : 0,
        loadedAll: false,
        busy: false,
        total: 51
      }
    },
    directives: {
      infiniteScroll
    },
    components: {
      FilmSuggestion
    },
    computed: {
      ...mapGetters('films', {allFilms: 'list'})
    },
    methods: {
      fetchNextPage: function () {
        this.busy = true
        this.page++
        const offset = 50 * this.page
        if (offset >= this.total){
          return
        }
        queries.getFilms(50 * this.page)
        .then(response => {this.total = response.total; this.busy = false})
        .catch(error => console.error(error))
      }
    },
    created() {
      queries.getFilms()
    }
  }
</script>