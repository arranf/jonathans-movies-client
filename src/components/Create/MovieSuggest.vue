<template>
  <v-select id="autocomplete" @input="fillBox" autocomplete item-text="name" return-object
    :placeholder="placeholder" chips deletable-chips item-value="name" no-data-text="Couldn't find that movie" :loading="loading" multiple cache-items 
    :hide-selected="true" :items="suggestions" :error-messages="errors" :search-input.sync="searchQuery" v-model="selected">
    <template slot="item" slot-scope="data">
      <!-- <div v-if="searchQuery != null && searchQuery.trim() === ''">
        Start typing to search for a film
      </div> -->
      <div v-if="suggestions.length > 0">
        <v-list-tile-content>
          <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
          <v-list-tile-sub-title v-html="getYear(data.item.release_date)"></v-list-tile-sub-title>
        </v-list-tile-content>
      </div>
      </template>
  </v-select>
</template>

<script>
import queries from '@/api'
import utils from '@/utils'

export default {
  data () {
    return {
      suggestions: [],
      searchQuery: null,
      loading: false,
      selected: []
    }
  },
  props: {
    placeholder: String,
    errors: Array
  },
  watch: {
    searchQuery (val) {
      val && this.getSuggestions(val)
    }
  },
  methods: {
    getSuggestions: function (searchTerm) {
      this.loading = true
      queries.getFilmSuggestions(searchTerm).then(response => {
        if (response && response.data) {
          this.suggestions = response.data
          this.loading = false
        }
      })
    },
    submit: function () {
      if (this.searchQuery.trim() !== '') {
        let chosenFilm = {name: this.searchQuery, film_id: null}
        this.$emit('fill', chosenFilm)
      }
    },
    fillBox: function (event) {
      const reducedOptions = this.selected.map(f => {
        if (f) {
          return {name: f.name, film_id: f._id}
        }
      })
      this.$emit('optionsChange', reducedOptions)
    },
    getYear: function (releaseDate) {
      return `(${utils.getYearFromTmdbReleaseDate(releaseDate)})`
    }
  }
}
</script>
