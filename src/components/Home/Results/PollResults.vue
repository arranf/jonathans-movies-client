<template>
  <!-- TODO: Check over this CSS -->
  <div
    class="d-flex flex-column align-items-center justify-items-center"
    style="width: 100%"
  >
    <div v-if="results && areVotes" style="width: 100%">
      <h1 class="md-headline text-center">Results</h1>
      <bar-chart style="padding-top: 3em" :data="results" />
    </div>
    <div v-else-if="emptyStateAllowed" class="empty-state-container">
      <v-icon size="100px" class="mb-2">error_outline</v-icon>
      <h1 class="display-1 mb-1">No Results</h1>
      <p class="empty-state-description">
        There needs to be at least one vote for there to be a winner!
      </p>
    </div>
  </div>
</template>

<script>
import BarChart from "./BarChart";
import { mapGetters, mapActions } from "vuex";
import { getCurrentPoll, getResults } from "@/api";

export default {
  name: "PollResults",
  components: {
    BarChart,
  },
  data() {
    return {
      results: null,
      emptyStateAllowed: false,
    };
  },
  computed: {
    ...mapGetters("poll", ["getMostRecentPoll"]),
    areVotes() {
      return this.results.some((result) => result.votes && result.votes > 0);
    },
  },
  async mounted() {
    try {
      await this.setLoading("Home"); // this is required because 'Home' has two possible components that load data
      await getCurrentPoll();
      this.results = await getResults(this.getMostRecentPoll._id);
      this.emptyStateAllowed = true;
      this.setLoaded("Home");
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    ...mapActions("loading", ["setLoading", "setLoaded"]),
  },
};
</script>
