<template>
  <div @click="showModal()" class="h-100" v-if="film" >
    <img v-if="film.poster_path" class="img-fluid lazyload" 
      :src="getFilmPoster" :data-srcset="getFilmPosterSrcSet" :alt="film.name + ' image'">
   <img v-else class="img-fluid" :src="getFallbackPoster()" />
    <h4 class="text-center">
      {{film.name}}
    </h4>
  </div>
  <!--TODO: HANDLE OPTIONS WITHOUT FILMS -->
</template>

<script>
// eslint-disable-next-line
import lazySizes from 'lazysizes'
import utils from '@/utils'
import {mapGetters} from 'vuex'

export default {
  name: 'FilmPreview',
  props: {
    film: {required: true, type: Object},
    modalPageName: {required: true, type: String}
  },
  computed: {
    ...mapGetters('films', {getFilm: 'get'}),
    getFilmPosterSrcSet: function () {
      if (this.film.poster_path) {
        return utils.getTmdbPosterSrcSet(this.film.poster_path)
      }
      return ''
    },
    getFilmPoster: function () {
      if (this.film.svg_base64encoded) {
        return `data:image/svg+xml;base64,${this.film.svg_base64encoded}`
      }
      return this.film.poster_path
    }
  },
  methods: {
    showModal: function () {
      if (this.film) {
        this.$router.push({name: this.modalPageName, params: { filmId: this.film._id }})
      }
    },
    getFallbackPoster: function () {
      const posters = [
        'PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+PHJlY3QgZmlsbD0ibm9uZSIgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiBoZWlnaHQ9Ijc1MiIgd2lkdGg9IjUwMiIgeT0iLTEiIHg9Ii0xIi8+PC9nPjxnIHN0cm9rZT0ibnVsbCI+PHRpdGxlPkxheWVyIDE8L3RpdGxlPjxyZWN0IGZpbGw9IiMzMzY2NkMiIHg9IjAiIHk9IjAiIHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBpZD0ic3ZnXzEiIHN0cm9rZT0ibnVsbCIvPjwvZz48L3N2Zz4=',
        'PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+PHJlY3QgZmlsbD0ibm9uZSIgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiBoZWlnaHQ9Ijc1MiIgd2lkdGg9IjUwMiIgeT0iLTEiIHg9Ii0xIi8+PC9nPjxnIHN0cm9rZT0ibnVsbCI+PHRpdGxlPkxheWVyIDE8L3RpdGxlPjxyZWN0IGZpbGw9IiNjNjI4MjgiIHg9IjAiIHk9IjAiIHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBpZD0ic3ZnXzEiIHN0cm9rZT0ibnVsbCIvPjwvZz48L3N2Zz4=',
        'PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+PHJlY3QgZmlsbD0ibm9uZSIgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiBoZWlnaHQ9Ijc1MiIgd2lkdGg9IjUwMiIgeT0iLTEiIHg9Ii0xIi8+PC9nPjxnIHN0cm9rZT0ibnVsbCI+PHRpdGxlPkxheWVyIDE8L3RpdGxlPjxyZWN0IGZpbGw9IiMyODM1OTMiIHg9IjAiIHk9IjAiIHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBpZD0ic3ZnXzEiIHN0cm9rZT0ibnVsbCIvPjwvZz48L3N2Zz4=',
        'PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+PHJlY3QgZmlsbD0ibm9uZSIgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiBoZWlnaHQ9Ijc1MiIgd2lkdGg9IjUwMiIgeT0iLTEiIHg9Ii0xIi8+PC9nPjxnIHN0cm9rZT0ibnVsbCI+PHRpdGxlPkxheWVyIDE8L3RpdGxlPjxyZWN0IGZpbGw9IiMxNTY1YzAiIHg9IjAiIHk9IjAiIHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBpZD0ic3ZnXzEiIHN0cm9rZT0ibnVsbCIvPjwvZz48L3N2Zz4='
      ]
      return 'data:image/svg+xml;base64,' + utils.selectRandom(posters)
    }
  }
}
</script>