<template>
  <div>
    <transition name="fade">
      <loading v-if="fetchLoading" />
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
                  v-html="data.item.release_year"
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
            <small>({{ film.release_year }})</small>
          </h2>
        </v-card-title>

        <v-card-text style="padding-top: 0px">
          <div>
            <div class="flex">
              <h4 v-if="film.tagline" style="font-weight: 600">
                {{ film.tagline }}
              </h4>

              <a
                v-for="service in simpleServices"
                :key="service.name"
                :href="service.url"
                target="_blank"
              >
                <img :src="service.iconSrc" :alt="service.name" />
              </a>
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
import { addNomination } from "@/api";
import feathersClient from "@/api/feathers-client";
import { mapActions, mapState, mapGetters } from "vuex";
import { getTmdbBackdropImage } from "@/utils";

import Loading from "@/components/skeleton/Loading";
import MovieBg from "@/components/common/MovieBg";

export default {
  name: "NominateStreamingFilm",
  components: {
    MovieBg,
    Loading,
  },
  data() {
    return {
      showSearch: true,
      selectedFilm: null,
      searchQuery: null,
      suggestions: [],
      film: null,
      loading: false,
      fetchLoading: false,
    };
  },
  methods: {
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
    async selectFilm() {
      let film = this.selectedFilm;

      this.selectedFilm = film.name;
      this.fetchLoading = true;
      try {
        const additionalData = await feathersClient
          .service("/streaming-films")
          .get(film.external_ids.tmdb, {
            query: { justWatchId: film.just_watch_id },
          });
        film = {
          ...film,
          ...additionalData,
        };
        this.searchQuery = "";
        this.suggestions = [];
        this.film = film;
        this.showSearch = false;
        this.loading = false;
        this.fetchLoading = false;
      } catch (error) {
        console.error(error);
        this.setSnackbarText("Error fetching film information");
      }
    },
    async nominateFilm() {
      if (
        this.hasNominationsRemaining &&
        !this.isOptionForCurrentPoll(this.film_id) &&
        this.filmIsNominatable
      ) {
        // Copied to prevent a weird race condition
        const amountRemaining = JSON.parse(
          JSON.stringify(this.nominationsRemaining)
        );
        try {
          await addNomination(this.film);
          if (amountRemaining === 1) {
            this.$router.push("/home");
          } else {
            this.setSnackbarText(
              `Nominated. You have ${amountRemaining - 1} nomination${
                this.nominationsRemaining === 1 ? "" : "s"
              } left`
            );
            // Refresh to allow further searches
            this.$router.go();
          }
        } catch (error) {
          console.error(error);
          this.setSnackbarText(error.message ? error.message : error);
        }
      } else {
        this.setSnackbarText("Error adding nomination.");
      }
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
    ...mapGetters("option", [
      "hasNominationsRemaining",
      "isOptionForCurrentPoll",
      "nominationsRemaining",
    ]),
    ...mapGetters("poll", ["isCurrentPollInNomination"]),
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
      return (
        this.film.services.length !== 0 &&
        // user has left to spend and isn't already nominated
        this.hasNominationsRemaining &&
        !this.isOptionForCurrentPoll(this.film._id)
      );
    },
    simpleServices() {
      const mapping = {
        Netflix: "/icons8-netflix-desktop-app.svg",
        "Disney Plus": "/icons8-disney-movies.svg",
        "Amazon Prime Video": "/icons8-amazon.svg",
      };
      return this.film.services.map((s) => ({
        name: s.name,
        url: s.item_url,
        iconSrc: mapping[s.name],
      }));
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
