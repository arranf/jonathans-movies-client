<template>
  <div>
    <transition name="fade">
      <div v-if="showSearch" class="empty-state-container">
        <icon v-once size="100px" class="mb-2">playlist_add</icon>
        <h1 class="display-1 mb-1">Add Films</h1>
        <p class="empty-state-description">Search to find films to add to your online collection</p>
        <v-autocomplete
            solo
            @input="selectFilm"
            label="Find a Film"
            :loading="loading"
            return-object
            clearable
            :items="suggestions"
            :search-input.sync="searchQuery"
            item-value="title"
            item-text="title"
            no-data-text="No Film Found"
            v-model="selectedFilm"
            :no-filter="true"
          >
            <template slot="item" slot-scope="data">
              <div>
                <v-list-tile-content>
                  <v-list-tile-title v-html="data.item.title"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="getYear(data.item.release_date)"></v-list-tile-sub-title>
                </v-list-tile-content>
              </div>
            </template>
          </v-autocomplete>
      </div>

      <card v-if="!showSearch && film">
            <movie-bg v-if="film.backdrop_path" :film="film" />
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
            <v-btn @click="addFilm" :disabled="isDuplicateForCurrent" color="primary">{{addButtonLabel}}</v-btn>
            <v-btn flat @click="closePreview" >Cancel</v-btn>
          </v-card-actions>
        </card>
      </transition>
  </div>
</template>

<script>
import { getMovieData, searchForMovie } from '@/api/tmdb'
import { genres } from '@/constants'
import { mapActions, mapState } from 'vuex'
import { getYearFromTmdbReleaseDate } from '@/utils'

import MovieBg from '@/components/common/MovieBg'
import Icon from '@/components/Lite/Icon'
import Card from '@/components/Lite/Card'

export default {
  name: 'AddMovie',
  components: {
    MovieBg,
    Icon,
    Card
  },
  data () {
    return {
      showSearch: true,
      isDuplicateForCurrent: false,
      isDuplicateForOther: false,
      selectedFilm: null,
      searchQuery: null,
      suggestions: [],
      currentFilmResponse: {},
      film: null,
      loading: false
    }
  },
  methods: {
    ...mapActions('films', ['create', 'find']),
    ...mapActions('loading', ['setLoading', 'setLoaded']),
    ...mapActions('collection', { getCurrentCollection: 'getCurrent' }),
    ...mapActions('snackbar', { setSnackbarText: 'setText' }),
    getFilms: function (searchTerm) {
      if (searchTerm.trim()) {
        this.loading = true
        searchForMovie(searchTerm).then(response => {
          if (response) {
            this.suggestions = response.results.slice(0, 5)
          } else {
            this.suggestions = [{ title: '' }]
          }
          this.loading = false
        })
      }
    },
    selectFilm () {
      let film = {
        tmdb_id: this.selectedFilm.id,
        name: this.selectedFilm.title,
        last_watched: null,
        tmdb_rating: this.selectedFilm.vote_average,
        overview: this.selectedFilm.overview,
        release_date: this.selectedFilm.release_date,
        genres: this.selectedFilm.genre_ids.map(
          id => genres.find(g => g.id === id).name
        )
      }

      this.currentFilmResponse = {}

      this.selectedFilm = film.name
      Promise.all([
        getMovieData(film.tmdb_id),
        this.find({ query: { tmdb_id: film.tmdb_id, ignoreCollectionLimits: true } })
      ])
        .then(responses => {
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
          const { Film } = this.$FeathersVuex
          this.film = new Film(film) // allows us to use vuex instance defaults by doing this
          this.isDuplicateForOther = apiResponse.total > 0
          this.isDuplicateForCurrent = apiResponse.total > 0 && apiResponse.data.every(a => a.owned_by.indexOf(this.currentCollection) > -1)
          this.showSearch = false
          return apiResponse
        })
        .then(apiResponse => {
          if (apiResponse.data.length === 1) {
            this.currentFilmResponse = apiResponse.data[0]
          }
        })
        .catch(e => {
          console.error(e)
          this.setSnackbarText('Error fetching film information')
        })
    },
    addFilm () {
      if (this.isDuplicateForCurrent) {

      } else if (this.isDuplicateForOther) {
        this.currentFilmResponse.owned_by.push(this.currentCollection)
        this.currentFilmResponse.patch()
          .then(() => {
            this.setSnackbarText(`Added ${this.film.name} to ${this.currentCollection}'s collection`)
            this.selectedFilm = ''
            this.film = null
            this.showSearch = true
          })
          .catch(e => {
            console.error(e)
            this.setSnackbarText('Error adding film')
          })
      } else {
        this.film.owned_by = [this.currentCollection]
        this.film
          .create()
          .then(() => {
            this.setSnackbarText(`Successfully added ${this.film.name} to ${this.currentCollection}'s collection`)
            this.selectedFilm = ''
            this.film = null
            this.showSearch = true
          })
          .catch(e => {
            console.error(e)
            this.setSnackbarText('Error adding film')
          })
      }
    },
    getYear (releaseDate) {
      return `(${getYearFromTmdbReleaseDate(releaseDate)})`
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
    ...mapState('collection', { currentCollection: 'current' }),
    truncatedOverview () {
      if (!this.film.overview) {
        return ''
      }
      if (!(this.film.overview.length > 350)) {
        return this.film.overview
      }
      return (
        this.film.overview.substring(0, 350) +
        (this.film.overview.length > 350 ? '...' : '')
      )
    },
    addButtonLabel () {
      if (this.isDuplicateForCurrent) {
        return `Already in ${this.currentCollection}'s Collection`
      } else {
        return `Add to ${this.currentCollection}'s Collection`
      }
    }
  },
  async created () {
    await this.getCurrentCollection()
    await this.setLoaded('Add')
  }
}
</script>

<style>
.fade-enter-active{
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
