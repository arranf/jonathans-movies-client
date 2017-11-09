<template>
  <div>
    <div ref="container" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-on-clickaway="away" @focus="showSuggestions = true">
      <input @focus="showSuggestions = true" ref="focusTarget" class="mdl-textfield__input" id="movie-suggest" type="text" v-model="searchQuery" @input="getSuggestions()" >
      <label class="mdl-textfield__label" :for="'movie-suggest'">Movie Title</label>
    </div>
    <mdl-button accent @click.native.prevent="submit" :disabled="!isSearchQueryEmpty"><i class="fa fa-check" aria-disabled="true"></i></mdl-button>
    <div v-if="suggestions.length > 0 && !completed && showSuggestions" class="autocomplete-suggestions w-90">
      <div @click="fillBox(suggest)" class="autocomplete-suggestion autocomplete-selected" :key="suggest.tmdbid" v-for="suggest in suggestions">
        {{suggest.name}} {{getYear(suggest.release_date)}}
      </div>
    </div>
  </div>
</template>

<script>
import { MdlButton } from 'vue-mdl'
import { mixin as clickaway } from 'vue-clickaway'
import debounce from 'lodash/debounce'
import queries from '@/api'
import utils from '@/utils'

export default {
  mixins: [ clickaway ],
  components: {
    MdlButton
  },
  data () {
    return {
      suggestions: [],
      searchQuery: '',
      completed: false,
      showSuggestions: true
    }
  },
  mounted () {
    componentHandler.upgradeElement(this.$refs.container) //eslint-disable-line
    this.getSuggestions = debounce(this.getResults, 300, {leading: true})
  },
  methods: {
    getResults: function () {
      if (this.completed) {
        this.completed = false
      }

      queries.getFilmSuggestions(this.searchQuery).then(response => {
        if (response && response.data) {
          this.suggestions.splice(0, this.suggestions.length)
          response.data.forEach((result) => {
            this.suggestions.push(result)
          })
        }
      })
    },
    submit: function () {
      if (this.searchQuery.trim() !== '') {
        let chosenFilm = {name: this.searchQuery, film_id: null}
        this.$emit('fill', chosenFilm)
        this.searchQuery = ''
      }
    },
    fillBox: function (toFill) {
      this.searchQuery = toFill.name
      let chosenFilm = {name: toFill.name, film_id: toFill._id}
      this.completed = true
      this.$emit('fill', chosenFilm)
      this.searchQuery = ''
    },
    away: function () {
      this.showSuggestions = false
    },
    getYear: function (releaseDate) {
      return `(${utils.getYearFromTmdbReleaseDate(releaseDate)})`
    }
  },
  computed: {
    isSearchQueryEmpty: function () {
      return this.searchQuery.trim() !== ''
    }
  }
}
</script>

<style scoped>
   .autocomplete-suggestions {
      z-index: 999;
   }
</style>

