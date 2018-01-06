<template>
  <div class="md-layout">
  <transition>
    <md-empty-state
        v-if="showSearch"
        md-icon="library_add"
        md-label="Add movies"
        md-description="Search to find movies to add to your online collection">
        <md-autocomplete
        v-model="selectedFilm"
        :md-options="suggestions"
        @md-changed="getMovies" 
        @md-opened="getMovies"
        @md-selected="selectMovie">
          <template slot="md-autocomplete-item" slot-scope="{ item, term }">
            <div :id="`suggestion-${item._id}`"><md-highlight-text :md-term="term">{{ item.title }}</md-highlight-text> <small>{{getYear(item.release_date)}}</small></div>
          </template>
          <label>Search</label>
      </md-autocomplete>
    </md-empty-state>

    <md-card v-if="!showSearch && movie">
        <md-card-area md-inset>
          <md-card-media v-if="movie.backdrop_path" md-ratio="16:9">
            <img :src="getBackdropImage" :alt="`${movie.title} Backdrop`">
          </md-card-media>

          <md-card-header>
            <h2 class="md-title">{{movie.name}} <small>{{getYear(movie.release_date)}}</small></h2>
            <div v-if="movie.tagline" class="md-subhead">
              <!-- <md-icon>location_on</md-icon> -->
              <span>{{movie.tagline}}</span>
            </div>
          </md-card-header>

          <md-card-content>
            {{movie.overview}}
          </md-card-content>
        </md-card-area>

        <md-card-actions>
          <md-button @click="addFilm" :disabled="isDuplicate" class="md-primary md-raised">{{isDuplicate ? 'Already in Collection' : 'Add'}}</md-button>
          <md-button @click="showSearch = true" >Cancel</md-button>
        </md-card-actions>
      </md-card>
    </transition>

    <md-snackbar :md-active.sync="showSnackbar">
      <span>{{snackbarMessage}}</span>
      <md-button class="md-primary" @click="showSnackbar = false">Close</md-button>
    </md-snackbar>
  </div>
</template>


<script>
import tmdbApi from '@/api/tmdb'
import constants from '@/constants'
import {mapActions} from 'vuex'
import utils from '@/utils'

export default {
  name: 'AddMovie',
  data () {
    return {
      snackbarMessage: '',
      showSearch: true,
      isDuplicate: false,
      showSnackbar: false,
      selectedFilm: '',
      suggestions: [],
      movie: null
    }
  },
  methods: {
    ...mapActions('films', ['create', 'find']),
    getMovies: function (searchTerm) {
      if (searchTerm) {
        this.suggestions = new Promise(resolve => {
          tmdbApi.searchForMovie(searchTerm)
            .then(response => {
              if (response && response.data) {
                resolve(response.data.results)
              } else {
                resolve([])
              }
            })
        })
      }
    },
    selectMovie () {
      let movie =
      {
        tmdb_id: this.selectedFilm.id,
        name: this.selectedFilm.title,
        last_watched: null,
        score: this.selectedFilm.vote_average,
        overview: this.selectedFilm.overview,
        release_date: this.selectedFilm.release_date,
        genres: this.selectedFilm.genre_ids.map(id => constants.genres.find(g => g.id === id).name)
      }

      this.selectedFilm = movie.name
      Promise.all([tmdbApi.getMovieData(movie.tmdb_id), this.find({query: {tmdb_id: movie.tmdb_id}})])
        .then((responses) => {
          const tmdbResponse = responses[0]
          const apiResponse = responses[1]
          movie.backdrop_path = tmdbResponse.data.backdrop_path
          movie.poster_path = tmdbResponse.data.poster_path
          movie.budget = tmdbResponse.data.budget
          movie.imdb_id = tmdbResponse.data.imdb_id
          movie.tagline = tmdbResponse.data.tagline
          movie.runtime = tmdbResponse.data.runtime
          this.movie = movie
          this.isDuplicate = apiResponse.total > 0
          this.showSearch = false
        })
        .catch(e => { console.error(e); this.showSnackbar = true; this.snackbarMessage = 'Error fetching movie information' })
    },
    addFilm () {
      if (!this.isDuplicate) {
        this.create(this.movie)
          .then(() => {
            this.snackbarMessage = `Successfully added ${this.movie.name}'`
            this.selectedFilm = ''
            this.movie = null
            this.showSearch = true
            this.showSnackbar = true
          })
          .catch(e => { console.error(e); this.showSnackbar = true; this.snackbarMessage = 'Error adding movie' })
      }
    },
    getYear (releaseDate) {
      return `(${utils.getYearFromTmdbReleaseDate(releaseDate)})`
    }
  },
  computed: {
    getBackdropImage () {
      if (this.movie) {
        return utils.getTmdbBackdropImage(this.movie.backdrop_path)
      }
      return ''
    }
  }
}
</script>
