<template>
<!-- TODO: Check over this CSS -->
<div class="d-flex flex-column align-items-center justify-items-center" style="width: 100%">
  <!-- TODO: Refactor to Use a Simpler Getter -->
  <div v-if="getMostRecentPoll && areVotes" style="width: 100%">
    <h1 class="md-headline text-center">Results</h1>
    <bar-chart style="padding-top: 3em" :data="results" :colors="backgroundColors"/>
  </div>
  <div v-else-if="emptyStateAllowed" class="empty-state-container">
    <v-icon size="100px" class="mb-2">error_outline</v-icon>
    <h1 class="display-1 mb-1">No Results</h1>
    <p class="empty-state-description">There needs to be at least one vote for there to be a winner!</p>
  </div>
</div>
</template>

<script>
import BarChart from './BarChart'
import { mapGetters, mapState } from 'vuex'
import utils from '@/utils'
import queries from '@/api'

export default {
  name: 'Results',
  components: {
    BarChart
  },
  data () {
    return {
      backgroundColors: [],
      emptyStateAllowed: false
    }
  },
  computed: {
    ...mapGetters('vote', ['getGraphData', 'areVotesForPoll']),
    ...mapGetters('poll', ['getMostRecentPoll']),
    ...mapState('vote', ['isFindPending']),
    results () {
      return this.getGraphData(this.getMostRecentPoll)
    },
    areVotes: function () {
      if (this.getMostRecentPoll) {
        return this.areVotesForPoll(this.getMostRecentPoll)
      }
      return false
    }
  },
  mounted () {
    queries
      .getCurrentPoll()
      .then(() => queries.getVotesForMostRecentPoll(this.getMostRecentPoll))
      .then(response => {
        this.backgroundColors = utils.getUniqueColors(
          this.getMostRecentPoll.options.length,
          '500'
        )
      })
      .then(a => {
        this.emptyStateAllowed = true
      })
      .catch(error => console.error(error))
  }
}
</script>
