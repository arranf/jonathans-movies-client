<template>
<div class="d-flex flex-column align-items-center justify-items-center">
  <div 
    v-if="getMostRecentPoll && dataCollection.datasets && dataCollection.datasets.length > 0 && winningOptions.length > 0"  
    >
    <h1 class="md-headline text-center">{{winningOptions.length > 1 ? winningOptions.slice(0, winningOptions.length - 1).join(', ') + " and " + winningOptions.slice(-1) : winningOptions[0]}} Wins</h1>
    <pie-chart :chart-data="dataCollection" :options="{responsive: true, maintainAspectRatio: false}" />
  </div>
  <div v-cloak v-else-if="winningOptions.length === 0 && emptyStateAllowed" class="empty-state-container">
    <v-icon size="100px" class="mb-2">error_outline</v-icon>
    <h1 class="display-1 mb-1">No Results</h1>
    <p class="empty-state-description">There needs to be at least one vote for there to be a winner!</p>
  </div>
</div>
</template>

<script>
import PieChart from './PieChart.js'
import {mapGetters, mapState} from 'vuex'
import utils from '@/utils'
import constants from '@/constants'
import queries from '@/api'

export default {
  name: 'Results',
  components: {
    PieChart
  },
  data () {
    return {
      backgroundColors: [],
      emptyStateAllowed: false
    }
  },
  computed: {
    ...mapGetters('vote', ['getGraphData', 'getHighestVotedOptionsForPoll']),
    ...mapGetters('poll', ['getMostRecentPoll', 'howLongAgoMostRecentPoll']),
    ...mapState('vote', ['isFindPending']),
    dataCollection: function () {
      const graphData = this.getGraphData(this.getMostRecentPoll._id)
      if (!graphData) {
        return {datasets: [], labels: []}
      }
      return {datasets: [{data: graphData.data, label: 'Vote', backgroundColor: this.backgroundColors}], labels: graphData.labels}
    },
    winningOptions: function () {
      if (this.getMostRecentPoll && this.getMostRecentPoll._id) {
        return this.getHighestVotedOptionsForPoll(this.getMostRecentPoll._id)
      }
      return []
    }
  },
  mounted () {
    queries.getCurrentPoll()
      .then(() => queries.getVotesForMostRecentPoll(this.getMostRecentPoll._id))
      .then(() => queries.getOptionsForMostRecentPoll(this.getMostRecentPoll._id))
      .then(response => { this.backgroundColors = utils.selectRandomArraySize(constants.colors['800'], response.data.length) })
      .then(a => { this.emptyStateAllowed = true })
      .catch(error => console.log(error))
  }
}
</script>

<style>
.fa-trophy {
  color: #F6BD1C;
}

[v-cloak] {
  display: none;
}
</style>