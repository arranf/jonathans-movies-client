<template>
  <v-toolbar :fixed="true" dark color="primary">
 <v-toolbar-side-icon @click="$emit('toggleNavigation')" v-if="user"></v-toolbar-side-icon>
    <v-toolbar-title v-if="!showMovieSearch" class="white--text">Jonathan's Movies</v-toolbar-title>
    <v-spacer></v-spacer>
    <!-- <md-autocomplete v-if="showMovieSearch"
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
    </md-autocomplete> -->
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
// import VToolbar from 'vuetify/es5/components/VToolbar'
// import VMenu from 'vuetify/es5/components/VMenu'
// import VForm from 'vuetify/es5/components/VForm'

import queries from '@/api'
import utils from '@/utils'
import {mapGetters, mapState} from 'vuex'

export default {
  name: 'Toolbar',
  data () {
    return {
      selectedFilm: '',
      options: []
    }
  },
  // components: {
  //   VToolbar,
  //   VMenu,
  //   VForm
  // },
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
      this.$router.push({name: 'Movies', params: { filmId: this.selectedFilm._id }})
      this.selectedFilm = ''
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
      return this.$route.name === 'Movies'
    }
  }
}
</script>
