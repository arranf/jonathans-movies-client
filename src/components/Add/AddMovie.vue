<template>
  <div>
    <transition>
      <div v-if="showSearch" class="empty-state-container">
        <v-icon size="100px" class="mb-2">library_add</v-icon>
        <h1 class="display-1 mb-1">Add Movies</h1>
        <p class="empty-state-description">Search to find movies to add to your online collection</p>
        <v-select
            solo
            @input="selectMovie" 
            label="Find a Movie"
            autocomplete
            :loading="loading"
            return-object
            clearable
            :items="suggestions"
            :search-input.sync="searchQuery"
            item-value="title"
            item-text="title"
            v-model="selectedFilm"
          >
            <template slot="item" slot-scope="data">
              <div>
                <v-list-tile-content>
                  <v-list-tile-title v-html="data.item.title"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="getYear(data.item.release_date)"></v-list-tile-sub-title>
                </v-list-tile-content>
              </div>
            </template>
          </v-select>
      </div>

      <v-card v-if="!showSearch && movie">
            <v-card-media v-if="movie.backdrop_path" height="200px" :src="getBackdropImage" :alt="`${movie.title} Backdrop`" />

            <v-card-title>
              <h2 class="md-title">{{movie.name}} <small>{{getYear(movie.release_date)}}</small></h2>
              <div v-if="movie.tagline" class="md-subhead">
                <span>{{movie.tagline}}</span>
              </div>
            </v-card-title>

            <v-card-text>
              {{truncatedOverview}}
            </v-card-text>

          <v-card-actions>
            <v-btn @click="addFilm" :disabled="isDuplicate" color="primary">{{isDuplicate ? 'Already in Collection' : 'Add'}}</v-btn>
            <v-btn flat @click="closePreview" >Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </transition>

    <v-snackbar v-model="showSnackbar">
      <span>{{snackbarMessage}}</span>
      <v-btn color="primary" @click="showSnackbar = false">Close</v-btn>
    </v-snackbar>
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
      selectedFilm: null,
      searchQuery: null,
      suggestions: [],
      movie: null,
      loading: false
    }
  },
  methods: {
    ...mapActions('films', ['create', 'find']),
    getMovies: function (searchTerm) {
      if (searchTerm) {
        this.loading = true
        tmdbApi.searchForMovie(searchTerm)
          .then(response => {
            if (response && response.data) {
              this.suggestions = response.data.results.slice(0, 5)
            }
            this.loading = false
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
    },
    closePreview () {
      this.showSearch = true
      this.selectedFilm = null
      this.searchQuery = null
    }
  },
  watch: {
    searchQuery (val) {
      val && this.getMovies(this.searchQuery)
    }
  },
  computed: {
    getBackdropImage () {
      if (this.movie) {
        return utils.getTmdbBackdropImage(this.movie.backdrop_path)
      }
      return ''
    },
    truncatedOverview () {
      if (!this.movie.overview.length > 350) {
        return this.movie.overview
      }
      return this.movie.overview.substring(0, 350) + (this.movie.overview.length > 350 ? '...' : '')
    }
  }
}
</script>
