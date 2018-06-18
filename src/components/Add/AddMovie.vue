<template>
  <div>
    <transition>
      <div v-if="showSearch" class="empty-state-container">
        <v-icon size="100px" class="mb-2">playlist_add</v-icon>
        <h1 class="display-1 mb-1">Add Films</h1>
        <p class="empty-state-description">Search to find films to add to your online collection</p>
        <v-select
            solo
            @input="selectFilm" 
            label="Find a Film"
            autocomplete
            :loading="loading"
            return-object
            clearable
            :items="suggestions"
            :search-input.sync="searchQuery"
            item-value="title"
            item-text="title"
            no-data-text="No Film Found"
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

      <v-card v-if="!showSearch && film">
            <movie-bg v-if="film.backdrop_path" :film="film" :height="200" />
            <v-card-title>
              <h2 class="md-title">{{film.name}} <small>{{getYear(film.release_date)}}</small></h2>
            </v-card-title>


            <v-card-text style="padding-top: 0px">
              <div v-if="film.tagline">
                <h4 style="font-weight: 600">{{film.tagline}}</h4>
              </div>
            </v-card-text>

            <v-card-text style="padding-top: 0px">
              {{truncatedOverview}}
            </v-card-text>

          <v-card-actions>
            <v-btn @click="addFilm" :disabled="isDuplicate" color="primary">{{isDuplicate ? 'Already in Collection' : 'Add'}}</v-btn>
            <v-btn flat @click="closePreview" >Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </transition>
  </div>
</template>


<script>
import * as VCard from 'vuetify/es5/components/VCard'
import * as VList from 'vuetify/es5/components/VList'
import {VIcon, VSelect, VBtn} from 'vuetify'

import tmdbApi from '@/api/tmdb'
import constants from '@/constants'
import {mapActions} from 'vuex'
import utils from '@/utils'

import MovieBg from '@/components/common/MovieBg'

export default {
  name: 'AddFilm',
  components: {
    ...VList,
    ...VCard,
    VIcon,
    VSelect,
    VBtn,
    MovieBg
  },
  data () {
    return {
      showSearch: true,
      isDuplicate: false,
      selectedFilm: null,
      searchQuery: null,
      suggestions: [],
      film: null,
      loading: false
    }
  },
  methods: {
    ...mapActions('films', ['create', 'find']),
    ...mapActions('snackbar', {setSnackbarText: 'setText'}),
    getFilms: function (searchTerm) {
      if (searchTerm.trim()) {
        this.loading = true
        tmdbApi.searchForMovie(searchTerm)
          .then(response => {
            if (response) {
              this.suggestions = response.results.slice(0, 5)
            } else {
              this.suggestions = [{'title': ''}]
            }
            this.loading = false
          })
      }
    },
    selectFilm () {
      let film =
      {
        tmdb_id: this.selectedFilm.id,
        name: this.selectedFilm.title,
        last_watched: null,
        tmdb_rating: this.selectedFilm.vote_average,
        overview: this.selectedFilm.overview,
        release_date: this.selectedFilm.release_date,
        genres: this.selectedFilm.genre_ids.map(id => constants.genres.find(g => g.id === id).name)
      }

      this.selectedFilm = film.name
      Promise.all([tmdbApi.getMovieData(film.tmdb_id), this.find({query: {tmdb_id: film.tmdb_id}})])
        .then((responses) => {
          const tmdbResponse = responses[0]
          const apiResponse = responses[1]
          film.backdrop_path = tmdbResponse.backdrop_path
          film.poster_path = tmdbResponse.poster_path
          film.budget = tmdbResponse.budget
          film.imdb_id = tmdbResponse.imdb_id
          film.tagline = tmdbResponse.tagline
          film.runtime = tmdbResponse.runtime
          this.searchQuery = ''
          this.suggestions = []
          this.film = film
          this.isDuplicate = apiResponse.total > 0
          this.showSearch = false
        })
        .catch(e => { console.error(e); this.setSnackbarText('Error fetching film information') })
    },
    addFilm () {
      if (!this.isDuplicate) {
        const { Film } = this.$FeathersVuex
        new Film(this.film).create()
          .then(() => {
            this.setSnackbarText(`Successfully added ${this.film.name}`)
            this.selectedFilm = ''
            this.film = null
            this.showSearch = true
          })
          .catch(e => { console.error(e); this.setSnackbarText('Error adding film') })
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
      val && val.trim() && this.getFilms(this.searchQuery)
    }
  },
  computed: {
    getBackdropImage () {
      if (this.film) {
        return utils.getTmdbBackdropImage(this.film.backdrop_path)
      }
      return ''
    },
    truncatedOverview () {
      if (!(this.film.overview.length > 350)) {
        return this.film.overview
      }
      return this.film.overview.substring(0, 350) + (this.film.overview.length > 350 ? '...' : '')
    }
  }
}
</script>
