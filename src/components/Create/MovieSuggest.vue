<template>
  <v-autocomplete id="autocomplete"
    autocomplete
    @input="optionsChange"
    browser-autocomplete="off"
    :search-input.sync="searchQuery"
    :loading="loading"
    :items="suggestions"
    return-object
    item-text="name"
    item-value="name"
    multiple
    v-model="selected"
    :placeholder="placeholder"
    no-data-text="No movie found"
    :hide-no-data="true"
    :hide-selected="true"
    :menu-props="{closeOnContentClick: true}"
    :error-messages="errors"
    chips
    deletable-chips
    cache-items
    :no-filter="true"
    :autofocus="true"
  >
    <template slot="item" slot-scope="data">
      <div>
        <v-list-tile-content>
          <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
          <v-list-tile-sub-title v-html="getYear(data.item.release_date)"></v-list-tile-sub-title>
        </v-list-tile-content>
      </div>
    </template>
    <v-progress-linear
      indeterminate
      slot="progress"
      height="4"
    />
    </v-autocomplete>
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
    searchQuery (newInput, oldInput) {
      if (newInput && newInput.trim()) {
        this.getSuggestions(newInput)
      } else {
        // This hides the empty element if the input is blank otherwise it appears an option
        this.suggestions = []
      }
    }
  },
  methods: {
    getSuggestions: function (searchTerm) {
      this.loading = true
      queries.getFilmSuggestions(searchTerm).then(response => {
        this.loading = false
        if (response && response.data && response.data.length) {
          this.suggestions = response.data
        } else {
          // This statement exists to make the no data text work as empty arrays fail to show it
          // this.suggestions = [{ name: '' }]
          this.suggestions = []
        }
      })
    },
    // addNonPredictedFilm: function () {
    //   // TODO: Make this component handle movies that aren't searchable films (i.e. Someone brings a movie to Jonathans)
    //   // Trigger Code on the component: @keyup.native.enter="addNonPredictedFilm"
    //   const searchQuery = this.searchQuery.trim()
    //   if (searchQuery !== '') {
    //     const newFilm = {name: searchQuery, _id: null}
    //     this.selected.push(newFilm)
    //     this.searchQuery = ''
    //     this.fillBox()
    //   }
    // },
    optionsChange: function (event) {
      const reducedOptions = this.selected.map(f => {
        if (f) {
          return { name: f.name, film_id: f._id }
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
