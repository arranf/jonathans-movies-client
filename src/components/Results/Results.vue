<template>
<div class="h-90 d-flex justify-content-center">
  <div v-if="getMostRecentPoll && dataCollection.datasets && dataCollection.datasets.length > 0 && winningOptions.length > 0">
    <h1 class="text-center"><i class="fa fa-trophy" aria-hidden="true"></i>
    <br/>
    {{winningOptions.length > 1 ? winningOptions.slice(0, winningOptions.length - 1).join(', ') + " and " + winningOptions.slice(-1) : winningOptions[0]}}</h1>
    <h6 class="text-center">{{howLongAgoMostRecentPoll}}</h6>   
   <pie-chart :chart-data="dataCollection" :options="{responsive: true, maintainAspectRatio: false}"></pie-chart>
  </div>
  <div v-else>
    <md-empty-state
      class="md-accent"
      md-icon="error_outline"
      md-label="No Results"
      md-description="There needs to be at least one vote for there to be a winner!">
    </md-empty-state>
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
      backgroundColors: []
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
      return this.getHighestVotedOptionsForPoll(this.getMostRecentPoll._id)
    }
  },
  mounted () {
    queries.getCurrentPoll()
      .then(() => queries.getVotesForMostRecentPoll(this.getMostRecentPoll._id))
      .then(() => queries.getOptionsForMostRecentPoll(this.getMostRecentPoll._id))
      .then(response => { this.backgroundColors = utils.selectRandomArraySize(constants.colors['800'], response.data.length) })
      .catch(error => console.log(error))
  }
}
</script>

<style>
.fa-trophy {
  color: #F6BD1C;
}
</style>