<template>
  <md-autocomplete id="autocomplete" md-input-name="suggest-input" md-input-id="suggest-input" v-model="searchQuery" :md-open-on-focus="false" :md-options="suggestions" @md-changed="getSuggestions" @md-selected="fillBox">
      <label for="suggest-input">Movies</label>

      <template slot="md-autocomplete-item" slot-scope="{ item, term }">
        <div :id="`suggestion-${item._id}`"><md-highlight-text :md-term="term">{{ item.name }}</md-highlight-text> <small>{{getYear(item.release_date)}}</small></div>
      </template>
      <template slot="md-autocomplete-empty" slot-scope="{ term }">
        <div v-if="term.trim() === ''">
          Start typing to search for a film
        </div>
        <div v-else>
          Couldn't find {{term}}. <a id="add-anyway" @click.prevent="submit(term)">Add it anyway!</a>
        </div>
      </template>
  </md-autocomplete>
</template>

<script>
import debounce from 'lodash/debounce'
import queries from '@/api'
import utils from '@/utils'

export default {
  data () {
    return {
      suggestions: [],
      searchQuery: ''
    }
  },
  methods: {
    getSuggestions: debounce(function (searchTerm) {
      queries.getFilmSuggestions(searchTerm).then(response => {
        if (response && response.data) {
          this.suggestions.splice(0, this.suggestions.length)
          response.data.forEach((result) => {
            this.suggestions.push(result)
          })
        }
      })
    }, 300, {leading: true}),
    submit: function (searchTerm) {
      if (searchTerm.trim() !== '') {
        let chosenFilm = {name: searchTerm, film_id: null}
        this.$emit('fill', chosenFilm)
        this.clearSearch()
      }
    },
    fillBox: function (film) {
      let chosenFilm = {name: film.name, film_id: film._id}
      this.$emit('fill', chosenFilm)
      this.clearSearch()
    },
    getYear: function (releaseDate) {
      return `(${utils.getYearFromTmdbReleaseDate(releaseDate)})`
    },
    clearSearch () {
      const element = document.getElementsByClassName('md-clear')[0]
      const event = new Event('click', {value: ''})
      element.dispatchEvent(event)
      this.searchQuery = ''
      setTimeout(() => {
        document.getElementById('suggest-input').dispatchEvent(new Event('blur'))
      }, 50)
    }
  },
  computed: {
    isSearchQueryEmpty: function () {
      return this.searchQuery.trim() !== ''
    }
  }
}
</script>
