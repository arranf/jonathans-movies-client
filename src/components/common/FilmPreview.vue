<template>
  <div @click="showModal()" class="h-100" v-if="film" >
  <img v-if="film.poster_path" class="img-fluid lazyload" :src="film.posterSvgPlaceholder" :data-srcset="film.tmdbPosterSrcSet" :alt="film.name + ' image'">
   <img v-else class="img-fluid" :src="getFallbackPoster()" />
    <h4 class="text-xs-center">
      {{film.name}}
    </h4>
    <p class="text-xs-center ml-1 mr-1 mt-1 text-smaller" v-if="reasons">
      Because you liked {{reasonsSentence}}
    </p>
  </div>
</template>

<script>
import { selectRandom } from '@/utils'

export default {
  name: 'FilmPreview',
  props: {
    film: { required: true, type: Object },
    modalPageName: { required: true, type: String },
    reasons: { type: Array },
    score: { type: Number }
  },
  computed: {
    reasonsSentence: function () {
      const arr = this.reasons
      if (arr.length === 1) {
        return arr[0]
      }
      // https://github.com/shinnn/array-to-sentence/blob/master/index.js
      return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1]
    }
  },
  methods: {
    showModal: function () {
      if (this.film) {
        this.$router.push({
          name: this.modalPageName,
          params: { filmId: this.film._id }
        })
      }
    },
    getFallbackPoster: function () {
      const posters = [
        'PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+PHJlY3QgZmlsbD0ibm9uZSIgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiBoZWlnaHQ9Ijc1MiIgd2lkdGg9IjUwMiIgeT0iLTEiIHg9Ii0xIi8+PC9nPjxnIHN0cm9rZT0ibnVsbCI+PHRpdGxlPkxheWVyIDE8L3RpdGxlPjxyZWN0IGZpbGw9IiMzMzY2NkMiIHg9IjAiIHk9IjAiIHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBpZD0ic3ZnXzEiIHN0cm9rZT0ibnVsbCIvPjwvZz48L3N2Zz4=',
        'PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+PHJlY3QgZmlsbD0ibm9uZSIgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiBoZWlnaHQ9Ijc1MiIgd2lkdGg9IjUwMiIgeT0iLTEiIHg9Ii0xIi8+PC9nPjxnIHN0cm9rZT0ibnVsbCI+PHRpdGxlPkxheWVyIDE8L3RpdGxlPjxyZWN0IGZpbGw9IiNjNjI4MjgiIHg9IjAiIHk9IjAiIHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBpZD0ic3ZnXzEiIHN0cm9rZT0ibnVsbCIvPjwvZz48L3N2Zz4=',
        'PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+PHJlY3QgZmlsbD0ibm9uZSIgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiBoZWlnaHQ9Ijc1MiIgd2lkdGg9IjUwMiIgeT0iLTEiIHg9Ii0xIi8+PC9nPjxnIHN0cm9rZT0ibnVsbCI+PHRpdGxlPkxheWVyIDE8L3RpdGxlPjxyZWN0IGZpbGw9IiMyODM1OTMiIHg9IjAiIHk9IjAiIHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBpZD0ic3ZnXzEiIHN0cm9rZT0ibnVsbCIvPjwvZz48L3N2Zz4=',
        'PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+PHJlY3QgZmlsbD0ibm9uZSIgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiBoZWlnaHQ9Ijc1MiIgd2lkdGg9IjUwMiIgeT0iLTEiIHg9Ii0xIi8+PC9nPjxnIHN0cm9rZT0ibnVsbCI+PHRpdGxlPkxheWVyIDE8L3RpdGxlPjxyZWN0IGZpbGw9IiMxNTY1YzAiIHg9IjAiIHk9IjAiIHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBpZD0ic3ZnXzEiIHN0cm9rZT0ibnVsbCIvPjwvZz48L3N2Zz4='
      ]
      return 'data:image/svg+xml;base64,' + selectRandom(posters)
    }
  }
}
</script>

<style scoped>
.text-smaller {
  font-size: 90% !important;
}
</style>
