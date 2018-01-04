<template>
  <div class="md-toolbar-row">
    <div class="md-toolbar-section-start">
      <md-button class="md-icon-button" @click="$emit('toggleNavigation')">
        <md-icon>menu</md-icon>
      </md-button>
      <span v-if="!showMovieSearch" class="md-title">Jonathan's Movies</span>
      <md-autocomplete v-if="showMovieSearch"
            class="search"
            v-model="selectedFilm"
            :md-options="options"
            @md-changed="getMovies" 
            @md-opened="getMovies"
            @md-selected="navigateToMovie"
            md-layout="box">
              <template slot="md-autocomplete-item" slot-scope="{ item, term }">
                <div :id="`suggestion-${item._id}`"><md-highlight-text :md-term="term">{{ item.name }}</md-highlight-text> <small>{{getYear(item.release_date)}}</small></div>
              </template>
              <label>Search...</label>
      </md-autocomplete>
    </div>
  </div>
</template>

<script>
import queries from '@/api'
import utils from '@/utils'

export default {
  name: 'Toolbar',
  data () {
    return {
      selectedFilm: '',
      options: []
    }
  },
  methods: {
    getMovies (searchTerm) {
      this.options = new Promise(resolve => {
        queries.getFilmSuggestions(searchTerm).then(response => {
          if (response && response.data) {
            resolve(response.data)
          } else {
            resolve([])
          }
        })
      })
    },
    getYear: function (releaseDate) {
      return `(${utils.getYearFromTmdbReleaseDate(releaseDate)})`
    },
    navigateToMovie () {
      this.selectedFilm = ''
    }
  },
  computed: {
    showMovieSearch () {
      return this.$route.name === 'Movies'
    }
  }
}
</script>
