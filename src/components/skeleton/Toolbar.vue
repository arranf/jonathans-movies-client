<template>
  <v-toolbar prominent app dark color="primary">
    <v-toolbar-side-icon @click="$emit('toggleNavigation')" v-if="user"></v-toolbar-side-icon>
    <v-toolbar-title v-if="!showMovieSearch" class="white--text">Jonathan's Movies</v-toolbar-title>
    <v-autocomplete v-if="showMovieSearch"
      solo
      light
      dense
      no-filter
      v-model="selectedFilm"
      :items="options"
      label="Search"
      :loading="loading"
      :search-input.sync="searchInput"
      @input="navigateToMovie"
      item-text="name"
      item-value="name"
      no-data-text="No Matching Movie Found"
      hide-selected
      return-object
      ></v-autocomplete>
      <v-spacer v-else></v-spacer>
    <v-menu v-if="user && user.isAdmin && (isCurrentPollInVoting || isCurrentPollInNomination)" :nudge-width="50" lazy>
      <v-btn icon slot="activator">
        <v-icon>more_vert</v-icon>
      </v-btn>
        <v-list>
          <v-list-tile v-if="isCurrentPollInNomination" @click.prevent="stopNominations()"><v-list-tile-title>End Nomination Phase</v-list-tile-title></v-list-tile>
          <v-list-tile @click.prevent="stopPoll()"><v-list-tile-title>Stop Poll</v-list-tile-title></v-list-tile>
        </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { getFilmSuggestions, stopPoll, stopNominations } from '@/api'
import { getYearFromTmdbReleaseDate } from '@/utils'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Toolbar',
  data () {
    return {
      selectedFilm: null,
      options: [],
      loading: false,
      searchInput: null
    }
  },
  watch: {
    searchInput (newInput, oldInput) {
      if (newInput && newInput.trim()) {
        this.getMovies(newInput)
      } else {
        // This hides the empty element if the input is blank otherwise it appears an option
        this.options = []
      }
    }
  },
  methods: {
    getMovies (searchTerm) {
      this.loading = true
      getFilmSuggestions(searchTerm)
        .then(response => {
          if (searchTerm.trim() === '') {
            this.options = []
          } else if (response && response.data && response.data.length) {
            this.options = response.data
          } else {
            this.options = []
          }
          this.loading = false
        })
        .catch(e => console.error(e))
    },
    getYear: function (releaseDate) {
      return `(${getYearFromTmdbReleaseDate(releaseDate)})`
    },
    navigateToMovie () {
      const id = this.selectedFilm._id
      this.searchQuery = ''
      this.options = []
      this.selectedFilm = null
      this.$router.push({ name: this.$route.name, params: { filmId: id } })
    },
    stopNominations () {
      stopNominations()
    },
    stopPoll () {
      stopPoll()
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('poll', [
      'isCurrentPollInNomination',
      'isCurrentPollInVoting'
    ]),
    showMovieSearch () {
      return this.$route.name === 'Movies' || this.$route.name === 'Discover'
    }
  }
}
</script>
