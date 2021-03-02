<template>
  <div>
    <movie-info-modal
      close-route="/christmas"
      :show.sync="showingFilm"
      :film-id="filmId"
      :show-nominate="true"
    />
    <transition name="slide">
      <v-btn
        v-if="seenIds.length > 24"
        fixed
        fab
        bottom
        right
        color="secondary"
        class="big-bottom"
        @click="scroll"
      >
        <v-icon>expand_less</v-icon>
      </v-btn>
    </transition>

    <div v-if="suggestions && suggestions.length">
      <h3 class="separator mt-4">Christmas Movies</h3>
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex
            v-for="(film, index) in suggestions"
            :key="film._id + index"
            xs6
            md3
            lg2
          >
            <film-preview
              :film="film"
              modal-page-name="Christmas"
            ></film-preview>
          </v-flex>
          <quote v-if="done" />
          <v-flex xs12>
            <v-progress-linear v-if="busy" color="secondary" indeterminate />
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
import FilmPreview from "@/components/common/FilmPreview";
import MovieInfoModal from "@/components/common/MovieInfoModal";
import Quote from "./Quote";
import { discoverChristmasMovies } from "@/api";

import scrollListener from "@/scroll-listener";
import { mapActions } from "vuex";

export default {
  name: "ChristmasDiscover",
  components: {
    FilmPreview,
    MovieInfoModal,
    Quote,
  },
  props: {
    filmId: String,
  },
  data() {
    return {
      showingFilm: false,
      suggestions: [],
      busy: false,
      seenIds: [],
      done: false,
      queueCount: 0,
    };
  },
  watch: {
    filmId(to, from) {
      this.showingFilm = Boolean(this.filmId);
    },
  },
  methods: {
    ...mapActions("snackbar", { setSnackbar: "setText" }),
    ...mapActions("loading", ["setLoaded"]),
    refresh: async function () {
      if (this.done) {
        return;
      }

      this.busy = true;
      try {
        const discoveredFilms = await discoverChristmasMovies(this.seenIds);
        if (discoveredFilms.length === 0) {
          this.done = true;
        }
        this.suggestions = this.suggestions.concat(discoveredFilms);
        this.seenIds = this.seenIds.concat(discoveredFilms.map((f) => f._id));
      } catch (e) {
        console.error(e);
        this.setSnackbar("Something went wrong. Try again.");
        this.busy = false;
      } finally {
        this.busy = false;

        if (this.queueCount > 0) {
          this.queueCount--;
          this.refresh();
        }
      }
    },
    scroll() {
      window.scrollTo(0, 0);
    },
    refreshQueueWrapper() {
      // This queue abstraction prevents a race condition where seenIds are not sent to the server before the next request
      // In this race duplicates may be shown extremely close together causing a weird expereince for users
      // By queueing requests on scroll we prevent a case where requests overlap
      if (this.busy) {
        this.queueCount++;
      } else {
        this.refresh();
      }
    },
  },
  computed: {
    disabled() {
      return this.busy || this.done;
    },
  },
  beforeDestroy() {
    document.removeEventListener("scroll", this.listener);
  },
  async created() {
    const nextPage = this.refreshQueueWrapper;
    this.listener = scrollListener(nextPage);
    // route watcher won't be called on initial load
    this.showingFilm = Boolean(this.filmId);
    try {
      await this.refresh();
      document.addEventListener("scroll", this.listener);
      await this.setLoaded("Christmas");
    } catch (e) {
      console.error(e);
      this.setSnackbar("Something went wrong. Try again.");
      this.$router.push("/home");
      document.removeEventListener("scroll", this.listener);
    }
  },
};
</script>

<style scoped>
.separator {
  text-align: left;
  /* font-size: 140%; */
  border-bottom: #1a237e 2px solid;
  margin-bottom: 0.5em;
  font-weight: 600;
  font-size: 130%;
  color: #111;
}

.slide-enter {
  transform: translateY(100%);
}
.slide-enter-to {
  transform: translateY(0);
}

.slide-leave {
  transform: translateY(0);
}
.slide-leave-to {
  transform: translateY(-100%);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 300ms ease-in;
}

.big-bottom {
  bottom: 64px;
}
</style>
