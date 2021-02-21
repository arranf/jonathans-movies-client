<template>
  <v-card :color="color" class="white--text">
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{ currentPhase }}</h3>
        <p>{{ currentPrimaryText }}</p>
        <p>{{ timeRemaining }}</p>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "StatusCard",
  computed: {
    ...mapGetters("poll", [
      "getActivePoll",
      "remainingTimeWordsForCurrentPoll",
      "isCurrentPollInNomination",
      "isCurrentPollInVoting",
      "remainingTimeInNominationWordsForCurrentPoll",
    ]),
    ...mapGetters("vote", { remainingVotes: "votesRemaining" }),
    ...mapGetters("option", { remainingNominations: "nominationsRemaining" }),
    currentPrimaryText: function () {
      if (this.isCurrentPollInNomination) {
        if (this.remainingNominations === 0) {
          return "Sit tight. You're out of nominations.";
        }
        return `You've got ${this.remainingNominations} nomination${
          this.remainingNominations > 1 ? "s" : ""
        } left. Use ${this.remainingNominations > 1 ? "them" : "it"} wisely!`;
      } else if (this.isCurrentPollInVoting) {
        if (this.remainingVotes === 0) {
          return "You're out of votes. You can still change your mind though.";
        }
        return `It's voting time! You've got ${this.remainingVotes} vote${
          this.remainingVotes > 1 ? "s" : ""
        }  to use. Cast ${this.remainingVotes > 1 ? "them" : "it"} carefully!`;
      }
      return "";
    },
    currentPhase: function () {
      if (this.isCurrentPollInNomination) {
        return "Nominations";
      } else if (this.isCurrentPollInVoting) {
        return "Voting";
      }
      return "";
    },
    timeRemaining: function () {
      if (this.isCurrentPollInNomination) {
        return this.remainingTimeInNominationWordsForCurrentPoll;
      } else if (this.isCurrentPollInVoting) {
        return this.remainingTimeWordsForCurrentPoll;
      }
      return "";
    },
    color: function () {
      if (this.isCurrentPollInNomination) {
        return "orange darken-3";
      } else if (this.isCurrentPollInVoting) {
        return "purple darken-3";
      }
      return "";
    },
  },
};
</script>

<style></style>
