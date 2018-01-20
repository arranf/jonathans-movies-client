<template>
  <v-toolbar app dark color="primary">
 <v-toolbar-side-icon @click="$emit('toggleNavigation')" v-if="user"></v-toolbar-side-icon>
    <v-toolbar-title v-if="!showMovieSearch" class="white--text">Jonathan's Movies</v-toolbar-title>
    <v-select v-if="showMovieSearch"
      solo
      light
      dense
      v-model="selectedFilm"
      :items="options"
      autocomplete
      label="Search"
      :loading="loading"
      :search-input.sync="searchInput"
      @input="navigateToMovie"
      item-text="name"
      item-value="name"
      return-object
      ></v-select>
      <v-spacer v-else></v-spacer>
    <v-menu v-if="user && user.isAdmin && (isCurrentPollInVoting || isCurrentPollInNomination)" :nudge-width="100">  
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
import queries from '@/api'
import utils from '@/utils'
import {mapGetters, mapState} from 'vuex'

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
      return newInput && this.getMovies(newInput)
    }
  },
  methods: {
    getMovies (searchTerm) {
      this.loading = true
      queries.getFilmSuggestions(searchTerm).then(response => {
        if (response && response.data) {
          this.options = response.data
        } else {
          this.options = []
        }
        this.loading = false
      })
    },
    getYear: function (releaseDate) {
      return `(${utils.getYearFromTmdbReleaseDate(releaseDate)})`
    },
    navigateToMovie () {
      const id = this.selectedFilm._id
      this.searchQuery = ''
      this.options = []
      this.selectedFilm = null
      this.$router.push({name: this.$route.name, params: { filmId: id }})
    },
    stopPoll () {
      queries.stopPoll()
    },
    stopNominations () {
      queries.stopNominations()
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('poll', ['isCurrentPollInNomination', 'isCurrentPollInVoting']),
    showMovieSearch () {
      return this.$route.name === 'Movies' || this.$route.name === 'Discover'
    }
  }
}
</script>
