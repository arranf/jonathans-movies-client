<template>
  <v-card>
    <!-- TODO: Replace with MovieBG (?) -->
    <div v-if="option && film && film.backdrop_path" class="card__media">
      <img
        class="img-fluid lazyload"
        :src="backdropImage"
        :data-srcset="getBackDropSrcSet"
        :alt="option.name + ' image'"
      />
      <div class="card__media__content"></div>
    </div>
    <v-card-title primary-title>
      <div
        v-if="film"
        class="flex-container justify-content-space-between fill-width"
      >
        <h3 class="headline mb-0">{{ option.name }}</h3>

        <div class="flex-0">
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
      <div v-if="film">{{ film.tagline }}</div>
    </v-card-title>
    <v-card-actions>
      <v-btn
        v-if="!isCurrentPollInNomination && getActivePoll"
        :color="voteButtonColor"
        :disabled="!isVoted(option._id) && remainingVotes <= 0"
        flat
        @click="vote"
        >{{ voteButtonText }}</v-btn
      >
      <v-btn v-if="film" flat color="orange" @click="showModal()"
        >More Info</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import constants from "@/constants";
import {
  humanizeTimeToNowImprecise,
  getTmdbBackdropImage,
  getTmdbBackdropSrcSet,
  selectRandom,
} from "@/utils";
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  name: "OptionPreview",
  props: {
    option: { type: Object, required: true },
    showInfo: { type: Boolean, default: true },
  },
  computed: {
    ...mapState("auth", ["user"]),
    ...mapGetters("films", { getFilm: "get" }),
    ...mapGetters("vote", { remainingVotes: "votesRemaining", votes: "list" }),
    ...mapGetters("poll", ["getActivePoll", "isCurrentPollInNomination"]),
    voteButtonText: function () {
      if (this.isVoted(this.option._id)) {
        return "Remove Vote";
      }
      return "Vote";
    },
    voteButtonColor: function () {
      if (this.isVoted(this.option._id)) {
        return "error";
      }
      return "primary";
    },
    lastWatched: function () {
      if (this.film && this.film.lastWatched) {
        return humanizeTimeToNowImprecise(this.film.lastWatched) + " ago";
      }
      return null;
    },
    backdropImage: function () {
      if (this.film && this.film.backdrop_svg_base64encoded) {
        return `data:image/svg+xml;base64,${this.film.backdrop_svg_base64encoded}`;
      }
      if (this.film && this.film.backdrop_path) {
        return getTmdbBackdropImage(this.film.backdrop_path);
      }
      return "";
    },
    getBackDropSrcSet: function () {
      if (this.film.backdrop_path) {
        return getTmdbBackdropSrcSet(this.film.backdrop_path);
      }
      return "";
    },
    film() {
      if (!this.option.film && this.option.film_id) {
        return this.getFilm(this.option.film_id);
      }
      return this.option.film;
    },
    simpleServices() {
      if (!this.film || !this.film.services) {
        return [];
      }

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
  methods: {
    ...mapActions("films", { fetchFilm: "get" }),
    ...mapActions("vote", { addVote: "create", removeVote: "remove" }),
    ...mapActions("snackbar", { setSnackbar: "setText" }),
    vote: function () {
      if (this.option == null) {
        this.setSnackbar("Error submitting vote.");
        return;
      }
      let optionId = this.option._id;
      if (this.isVoted(optionId)) {
        const vote = this.votes.find(
          (v) => v.user_id === this.user._id && v.option_id === optionId
        );
        this.removeVote(vote._id).catch((error) => console.error(error));
      } else {
        if (this.remainingVotes <= 0) {
          this.setSnackbar("Unable to vote. You don't have any votes left");
          return;
        }
        this.addVote({ poll_id: this.getActivePoll._id, option_id: optionId })
          .then(
            this.setSnackbar(
              `Voted! You have ${this.remainingVotes - 1} vote${
                this.remainingVotes === 1 ? "" : "s"
              } remaining`
            )
          )
          .catch((error) => {
            console.error(error);
            this.setSnackbar("Error submitting vote.");
          });
      }
    },
    isVoted: function () {
      return this.votes.some(
        (v) =>
          v && v.user_id === this.user._id && v.option_id === this.option._id
      );
    },
    getColor: function () {
      return selectRandom(constants.colors["800"]);
    },
    showModal: function () {
      if (this.film && this.showInfo) {
        this.$router.push({ name: "Home", params: { filmId: this.film._id } });
      }
    },
    created() {
      if (!this.film) {
        this.fetchFilm(this.option.film_id);
      }
    },
  },
};
</script>
