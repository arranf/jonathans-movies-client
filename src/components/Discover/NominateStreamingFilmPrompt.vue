<template>
  <v-card
    v-if="getActivePoll && isCurrentPollInNomination && remainingNominations"
    color="red darken-1"
    class="white--text mb-3 mt-1"
  >
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">Nominate a Streaming Movie</h3>
        <p>{{ currentPrimaryText }}</p>
        <p>{{ timeRemaining }}</p>
      </div>
    </v-card-title>

    <v-card-actions>
      <v-spacer />
      <v-btn
        color="secondary lighten-1"
        class="mr-3 mb-1 flat"
        @click="goNominate"
        >Nominate</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "NominateStreamingFilmPrompt",
  computed: {
    ...mapGetters("poll", [
      "getActivePoll",
      "isCurrentPollInNomination",
      "remainingTimeInNominationWordsForCurrentPoll",
    ]),
    ...mapGetters("option", { remainingNominations: "nominationsRemaining" }),
    currentPrimaryText: function () {
      if (this.isCurrentPollInNomination) {
        if (this.remainingNominations === 0) {
          return "Sit tight. You're out of nominations.";
        }
        return `Nominate a movie from Netflix, Amazon Prime, or Disney Plus. You've got ${
          this.remainingNominations
        } nomination${this.remainingNominations > 1 ? "s" : ""} left`;
      }
      return "";
    },
    timeRemaining: function () {
      if (this.isCurrentPollInNomination) {
        return this.remainingTimeInNominationWordsForCurrentPoll;
      }
      return "";
    },
  },
  methods: {
    goNominate: function () {
      this.$router.push({
        path: "/nominate-streaming-film",
      });
    },
  },
};
</script>

<style></style>
