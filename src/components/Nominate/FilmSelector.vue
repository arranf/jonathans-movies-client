<template>
   <div v-if="allFilms" v-infinite-scroll="fetchNextPage" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="scroll">
     <template v-for="film in allFilms">
      <film-suggestion class="m-1" :key="film._id" :film="film">
      </film-suggestion>
    </template>
    <loading-bounce v-if="busy"></loading-bounce>
  </div>  
</template>

<script>
import FilmSuggestion from './FilmSuggestion'
import infiniteScroll from 'vue-infinite-scroll'
import {mapGetters} from 'vuex'
import queries from '@/api'
import LoadingBounce from '@/components/Loading/LoadingBounce'

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
      FilmSuggestion,
      LoadingBounce
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


<style scoped>
  .scroll {
    overflow-y: scroll;
  }
</style>