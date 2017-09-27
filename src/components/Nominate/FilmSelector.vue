<template>
   <div>
     <template v-if="allFilms" v-for="film in allFilms">
      <film-suggestion class="m-2" :key="film._id" :film="film">
      </film-suggestion>
    </template>
  </div>
</template>

<script>
import FilmSuggestion from './FilmSuggestion'
import {mapGetters} from 'vuex'
import queries from '@/api'

  export default {
    name: 'FilmSelector',
    components: {
      FilmSuggestion
    },
    computed: {
      ...mapGetters('films', {allFilms: 'list'})
    },
    created() {
      queries.getAllFilms()
    }
  }
</script>