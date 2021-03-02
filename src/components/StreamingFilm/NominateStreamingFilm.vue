<template>
  <div>
    <transition name="fade">
      <div v-if="showSearch" class="empty-state-container">
        <!-- Todo Replace Icon -->
        <v-icon size="100px" class="mb-2">playlist_add</v-icon>
        <h1 class="display-1 mb-1">Find Films</h1>
        <p class="empty-state-description">
          Search films across Netflix, Disney Plus, and Amazon Prime VIdeo.
        </p>
        <v-autocomplete
          v-model="selectedFilm"
          solo
          label="Find a Film"
          :loading="loading"
          return-object
          clearable
          :items="suggestions"
          :search-input.sync="searchQuery"
          item-value="id"
          item-text="title"
          no-data-text="No Film Found"
          @input="selectFilm"
        >
          <template slot="item" slot-scope="data">
            <div>
              <v-list-tile-content>
                <v-list-tile-title v-html="data.item.title"></v-list-tile-title>
                <v-list-tile-sub-title
                  v-html="data.item.releaseYear"
                ></v-list-tile-sub-title>
              </v-list-tile-content>
            </div>
          </template>
        </v-autocomplete>
      </div>

      <v-card v-if="!showSearch && film">
        <movie-bg v-if="film.backdrop_path" :film="film" :height="200" />
        <v-card-title>
          <h2 class="md-title">
            {{ film.title }}
            <small>({{ film.releaseYear }})</small>
          </h2>
        </v-card-title>

        <v-card-text style="padding-top: 0px">
          <div v-if="film.tagline">
            <div class="flex">
              <h4 style="font-weight: 600">{{ film.tagline }}</h4>

              <img
                v-if="film.services.includes('Netflix')"
                src="/icons8-netflix.svg"
              />
              <img
                v-if="film.services.includes('Disney Plus')"
                src="/icons8-disney-plus.svg"
              />
              <img
                v-if="film.services.includes('Amazon Prime Video')"
                src="/icons8-amazon.svg"
              />
            </div>
          </div>
        </v-card-text>

        <v-card-text style="padding-top: 0px">{{
          truncatedOverview
        }}</v-card-text>

        <v-card-actions>
          <v-btn
            :disabled="film.services.length === 0"
            color="primary"
            @click="nominateFilm"
            >Nominate</v-btn
          >
          <v-btn flat @click="closePreview">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </transition>
  </div>
</template>

<script>
import feathersClient from "@/api/feathers-client";
import { getMovieData } from "@/api/tmdb";
import { mapActions, mapState } from "vuex";
import { getTmdbBackdropImage } from "@/utils";

import MovieBg from "@/components/common/MovieBg";

export default {
  name: "NominateStreamingFilm",
  components: {
    MovieBg,
  },
  data() {
    return {
      showSearch: true,
      selectedFilm: null,
      searchQuery: null,
      suggestions: [],
      currentFilmResponse: {},
      film: null,
      loading: false,
    };
  },
  methods: {
    ...mapActions("films", ["find"]),
    ...mapActions("loading", ["setLoading", "setLoaded"]),
    ...mapActions("snackbar", { setSnackbarText: "setText" }),
    searchForMovie: async function (searchTerm) {
      return feathersClient
        .service("/streaming-films")
        .find({ query: { name: searchTerm } });
    },
    getFilms: function (searchTerm) {
      if (searchTerm.trim()) {
        this.loading = true;
        this.searchForMovie(searchTerm).then((response) => {
          if (response) {
            this.suggestions = response.data.slice(0, 5);
          } else {
            this.suggestions = [{ title: "" }];
          }
          this.loading = false;
        });
        // TODO ERROR HANDLING
      }
    },
    selectFilm() {
      // TODO: MOVE THIS TO GET SERVER SIDE
      let film = this.selectedFilm;

      this.currentFilmResponse = {};

      this.selectedFilm = film.name;
      Promise.all([
        getMovieData(film.externalIds.tmdb),
        this.find({
          query: {
            tmdb_id: film.externalIds.tmdb,
            ignoreCollectionLimits: true,
          },
        }),
      ])
        .then((responses) => {
          const tmdbResponse = responses[0];
          const apiResponse = responses[1];
          film.backdrop_path = tmdbResponse.backdrop_path;
          film.poster_path = tmdbResponse.poster_path;
          film.budget = tmdbResponse.budget;
          film.imdb_id = tmdbResponse.imdb_id;
          film.tagline = tmdbResponse.tagline;
          film.runtime = tmdbResponse.runtime;
          film.overview = tmdbResponse.overview;
          this.searchQuery = "";
          this.suggestions = [];
          this.film = film;
          this.showSearch = false;
          return apiResponse;
        })
        .then((apiResponse) => {
          if (apiResponse.data.length === 1) {
            this.currentFilmResponse = apiResponse.data[0];
          }
        })
        .catch((e) => {
          console.error(e);
          this.setSnackbarText("Error fetching film information");
        });
    },
    nominateFilm() {
      // TODO
      // create call to upsert to database
      // then nominate on returned film id
      // do some snackbar stuff
    },
    closePreview() {
      this.showSearch = true;
      this.selectedFilm = null;
      this.searchQuery = null;
    },
  },
  watch: {
    searchQuery(val) {
      val && val.trim() && this.getFilms(this.searchQuery);
    },
  },
  computed: {
    ...mapState("collection", { currentCollection: "current" }),
    getBackdropImage() {
      if (this.film) {
        return getTmdbBackdropImage(this.film.backdrop_path);
      }
      return "";
    },
    truncatedOverview() {
      if (!(this.film.overview.length > 350)) {
        return this.film.overview;
      }
      return (
        this.film.overview.substring(0, 350) +
        (this.film.overview.length > 350 ? "..." : "")
      );
    },
    filmIsNominatable() {
      return this.film.services.length !== 0;
    },
  },
  async created() {
    await this.setLoaded("Nominate Streaming Film");
  },
};
</script>

<style>
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
