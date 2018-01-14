<template>
  <div class="md-toolbar-row">
    <div class="md-toolbar-section-start">
      <md-button v-if="user" class="md-icon-button" @click="$emit('toggleNavigation')">
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
    <div :class="{'md-toolbar-section-end': !showMovieSearch}" v-if="user && user.isAdmin && (isCurrentPollInVoting || isCurrentPollInNomination)">
      <md-menu md-direction="bottom-start" md-align-trigger>
        <md-button md-menu-trigger class="md-icon-button">
          <md-icon>more_vert</md-icon>
        </md-button>

        <md-menu-content>
          <md-menu-item @click.prevent="stopPoll()">Stop Poll</md-menu-item>
          <md-menu-item v-if="isCurrentPollInNomination" @click.prevent="stopNominations()">Stop Nominations</md-menu-item>
        </md-menu-content>
      </md-menu>
    </div>
  </div>
</template>

<script>
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
