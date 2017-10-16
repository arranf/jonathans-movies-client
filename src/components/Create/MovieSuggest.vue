<template>
  <div>
    <input type="text" v-model="searchQuery" @input="getSuggestions()" name="movies" class="form-control" @focus="completed = true" @blur="completed = false">
    <div v-if="suggestions.length > 0 && !completed" class="autocomplete-suggestions">
      <div @click="fillBox(suggest)" class="autocomplete-suggestion autocomplete-selected" :key="suggest.tmdbid" v-for="suggest in suggestions">
        {{suggest.name}}
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import queries from '@/api'
import { focus } from 'vue-focus';

export default {
  data() {
    return {
      suggestions: [],
      searchQuery: '',
      chosenFilm: {},
      completed: false
    }
  },
  props: [
    'index'
  ],
  methods: {
    getResults: function () {
      if (this.completed){
        this.completed = false
      }
      
      queries.getFilmSuggestions(this.searchQuery).then(response => {
        if (response && response.data){
          this.suggestions.splice(0, this.suggestions.length)
          response.data.forEach((result) => {
            this.suggestions.push(result)
          })
        }
      })

      this.$emit('fill', this.index, {name: this.searchQuery, film_id: null})
    },
    fillBox: function(toFill) {
      this.searchQuery = toFill.name
      this.chosenFilm = {name: toFill.name, film_id: toFill._id} 
      this.completed = true
      this.$emit('fill', this.index, this.chosenFilm)
    }  
  },
  mounted() {
    this.getSuggestions = debounce(this.getResults, 300, {leading: true})
  }
}
</script>

<style scoped>
  .autocomplete-suggestions { border: 1px solid #999; background: #fff; cursor: default; overflow: auto; }
  .autocomplete-suggestion { padding: 10px 5px; font-size: 1.2em; white-space: nowrap; overflow: hidden; }
  .autocomplete-selected { background: #f0f0f0; }
  .autocomplete-suggestions strong { font-weight: normal; color: #3399ff; }
</style>

