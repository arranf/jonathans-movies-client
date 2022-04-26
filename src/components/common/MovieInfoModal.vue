<template>
  <v-layout row justify-center>
    <!-- eslint-disable vue/no-mutating-props -->
    <v-dialog
      v-model="show"
      lazy
      fullscreen
      transition="dialog-bottom-transition"
      :overlay="false"
    >
      <!-- eslint-enable vue/no-mutating-props -->
      <v-card v-if="film">
        <movie-bg :height="30" :film="film" />

        <v-card-title primary-title>
          <div class="flex-container justify-content-space-between fill-width">
            <h1 class="headline mb-0">
              {{ film.name }} <small>({{ getFilmYear }})</small>
            </h1>
            <a
              v-if="film.imdbLink"
              :href="film.imdbLink"
              target="_blank"
              style="float: right"
            >
              <img src="/icons8-imdb-48.png" />
            </a>
          </div>
          <h3 class="subtitle grey--text text--darken-2">
            {{ film.tagline }}
          </h3>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md text-xs-left>
            <v-layout row wrap>
              <v-flex xs6>
                <h3 class="md-subheading">Information</h3>
                <div>
                  <div v-if="film.genres && film.genres.length">
                    <strong>Genres</strong>: {{ film.genres.join(", ") }}
                  </div>
                  <div v-if="film.runtime">
                    <strong>Runtime</strong>: {{ film.runtime }} mins
                  </div>
                  <div v-if="film.last_watched">
                    <strong>Last Watched</strong>: {{ film.last_watched }}
                  </div>
                </div>
              </v-flex>
              <v-flex xs6>
                <h3 class="md-subheading">Ratings</h3>
                <div>
                  <div v-if="film.imdb_rating">
                    <strong>IMDB</strong>: {{ film.imdb_rating }}
                  </div>
                  <div v-if="film.rotten_tomatoes_rating">
                    <strong>Rotten Tomatoes</strong>:
                    {{ film.rotten_tomatoes_rating }}%
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-slide-y-transition>
          <v-card-text v-if="showOverview">
            {{ film.overview }}
          </v-card-text>
        </v-slide-y-transition>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="inNominations"
            flat
            color="primary"
            :disabled="!nominatable"
            @click.prevent="addNomination()"
          >
            {{ nominateButtonText }}
          </v-btn>
          <v-btn flat @click="showOverview = !showOverview">
            <v-icon>{{
              !showOverview ? "keyboard_arrow_down" : "keyboard_arrow_up"
            }}</v-icon>
            Read Plot
          </v-btn>
          <a
            v-if="film.imdbLink"
            type="button"
            class="v-btn v-btn--flat theme--light"
            target="_blank"
            :href="film.imdbLink"
            ><div class="v-btn__content">Visit IMDB</div></a
          >
          <v-btn flat @click="closeModal()">Close</v-btn>
        </v-card-actions>
      </v-card>
      <loading v-else />
    </v-dialog>
  </v-layout>
</template>

<script>
import { addNomination } from "@/api";
import { getYearFromTmdbReleaseDate } from "@/utils";
import { mapGetters, mapActions } from "vuex";
import MovieBg from "./MovieBg";
import Loading from "@/components/skeleton/LoadingSpinner";

export default {
  name: "MovieInfoModal",
  components: {
    MovieBg,
    Loading,
  },
  props: {
    filmId: { type: String },
    showNominate: { default: true, type: Boolean },
    show: { type: Boolean },
    closeRoute: { type: String, required: true },
    shouldClose: { type: Boolean, default: true },
  },
  data() {
    return {
      shouldDisplay: false || !this.backdropImage,
      film: {},
      showOverview: false,
    };
  },
  methods: {
    ...mapActions("films", { fetchFilm: "get" }),
    ...mapActions("snackbar", { setSnackbar: "setText" }),
    modalOpened: function () {
      this.showOverview = false;
      // Use internal getter
      this.film = this.getFilm(this.filmId);

      // Someone has hit the page fresh
      if (!this.film) {
        // Fetch from API
        this.fetchFilm(this.filmId)
          .then((film) => {
            this.film = film;
            if (!film) {
              this.setSnackbar("Sorry! Couldn't find that film.");
              this.closeModal();
            }
          })
          .catch((error) => {
            console.error(error);
            this.setSnackbar("Sorry! Couldn't find that film.");
            this.closeModal();
          });
      }
    },
    closeModal: function () {
      this.$emit("update:show", false);
      if (this.shouldClose) {
        this.$router.replace(this.closeRoute);
      }
    },
    addNomination: function () {
      if (
        this.showNominate &&
        this.hasNominationsRemaining &&
        !this.isOptionForCurrentPoll(this.film_id)
      ) {
        // Copied to prevent a weird race condition
        const amountRemaining = JSON.parse(
          JSON.stringify(this.nominationsRemaining)
        );
        addNomination(this.film)
          .then(() => {
            this.$emit("update:show", false);
            if (amountRemaining === 1) {
              this.$router.push("/home");
            } else {
              this.setSnackbar(
                `Nominated. You have ${amountRemaining - 1} nomination${
                  this.nominationsRemaining === 1 ? "" : "s"
                } left`
              );
            }
          })
          .catch((e) => {
            console.error(e);
            this.setSnackbar(e.message ? e.message : e);
          });
      } else {
        this.setSnackbar("Error adding nomination.");
      }
    },
  },
  computed: {
    ...mapGetters("option", [
      "hasNominationsRemaining",
      "isOptionForCurrentPoll",
      "nominationsRemaining",
    ]),
    ...mapGetters("poll", ["isCurrentPollInNomination"]),
    ...mapGetters("films", { getFilm: "get" }),
    getFilmYear: function () {
      if (this.film && this.film.release_date) {
        return getYearFromTmdbReleaseDate(this.film.release_date);
      }
      return undefined;
    },
    nominateButtonText() {
      if (this.isOptionForCurrentPoll(this.film._id)) {
        return "Nominated";
      }
      return "Nominate";
    },
    inNominations() {
      // Set to show nominations
      return this.showNominate && this.isCurrentPollInNomination;
    },
    nominatable() {
      // user has left to spend and isn't already nominated
      return (
        this.hasNominationsRemaining &&
        !this.isOptionForCurrentPoll(this.film._id)
      );
    },
  },
  watch: {
    filmId: function (newFilmId, _oldFilmId) {
      if (newFilmId) {
        this.modalOpened();
      }
    },
  },
  created() {
    if (this.filmId) {
      this.modalOpened();
    }
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3D(0, 0, 0);
  will-change: opacity, margin-top;
  transition-property: opacity, margin-top;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
