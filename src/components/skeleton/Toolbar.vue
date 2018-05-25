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
      no-data-text="No Movie Found"
      return-object
      ></v-select>
      <v-spacer v-else></v-spacer>
      <v-tooltip bottom>
        <v-badge 
          slot="activator" 
          v-if="user && user.isAdmin && (isCurrentPollInVoting || isCurrentPollInNomination) && !showMovieSearch"
          color="red" 
          :class="{'mr-3': (isCurrentPollInVoting || isCurrentPollInNomination), 'mr-4': !(isCurrentPollInVoting || isCurrentPollInNomination)}" style="margin-left: 8px;"
        >
          <span slot="badge">{{getUsersCount}}</span>
          <v-icon color="grey lighten-3">person</v-icon>
        </v-badge>
        <span>Users Online</span>
      </v-tooltip>
    <v-menu v-if="user && user.isAdmin && (isCurrentPollInVoting || isCurrentPollInNomination)" :nudge-width="50">  
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
      queries.getFilmSuggestions(searchTerm).then(response => {
        if (searchTerm.trim() === '') {
          this.options = []
        } else if (response && response.data && response.data.length) {
          this.options = response.data
        } else {
          // This statement exists to make the no data text work as empty arrays fail to show it
          // TODO: remove this when upgrading to vuetify 1.1
          this.options = [{name: ''}]
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
    ...mapGetters('users-online', ['getUsersCount']),
    showMovieSearch () {
      return this.$route.name === 'Movies' || this.$route.name === 'Discover'
    }
  }
}
</script>
