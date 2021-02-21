<template>
  <v-progress-linear
    v-if="getActivePoll"
    v-model="percentageOfCurrentPhaseComplete"
    class="progress-linear"
    :color="color"
  />
</template>

<script>
import { mapGetters } from "vuex";

const dangerMark = 80;

export default {
  name: "ProgressBar",
  computed: {
    ...mapGetters("poll", [
      "getActivePoll",
      "percentageOfCurrentPhaseComplete",
    ]),
    color() {
      if (this.percentageOfCurrentPhaseComplete < dangerMark) {
        return "secondary";
      }
      return "red";
    },
  },
};
</script>

<style scoped>
.progress-linear {
  margin-top: 0;
  position: fixed;
  z-index: 5;
}
</style>
