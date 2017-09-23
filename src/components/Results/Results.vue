<template>
<div>
  <div v-if="getMostRecentPoll && datacollection.datasets && datacollection.datasets.length > 0 && datacollection.datasets[0].data.length > 0">
    <h1 class="text-center"><i class="fa fa-trophy" aria-hidden="true"></i>  {{winningOptions.length > 1 ? winningOptions.slice(0, winningOptions.length - 1).join(', ') + " and " + winningOptions.slice(-1) : winningOptions[0]}}</h1>
    <h6 class="text-center">{{howLongAgoMostRecentPoll}}</h6>   
   <pie-chart :chart-data="datacollection" :options="{responsive: true, maintainAspectRatio: false}"></pie-chart>
  </div>
  <div v-else>
    <h1 class="text-center">
      No Votes Were Cast
    </h1>
    <h6 class="text-center">{{howLongAgoMostRecentPoll}}</h6>   
  </div>
</div>
</template>

<script>
import PieChart from './PieChart.js'
import {mapActions, mapGetters, mapState} from 'vuex'
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
      datacollection: {datasets: [], labels: []},
      winningOptions: []
    }
  },
  computed: {
    ...mapGetters('vote', ['getGraphData', 'getHighestVotedOptionsForPoll']),
    ...mapGetters('poll', ['getMostRecentPoll', 'howLongAgoMostRecentPoll']),
    ...mapGetters('option', {getOption: 'get'}),
    ...mapState('vote', ['isFindPending'])
  },
  methods: {
    ...mapActions('poll', {
      getPolls: 'find'
    }),
    ...mapActions('vote', {
      getVotes: 'find'
    })
  },
  mounted () {
    queries.getCurrentPoll()
    // TODO Make this a smart query
    .then(data => queries.getVotesForMostRecentPoll(this.getMostRecentPoll._id))
    .then(data => queries.getOptionsForMostRecentPoll(this.getMostRecentPoll._id))
    .then(data => {
        const graphData = this.getGraphData(this.getMostRecentPoll._id)
        const backgroundColors = [];
        graphData.labels.forEach(label => backgroundColors.push(utils.selectRandom(constants.colors['800'])))
        this.datacollection = {datasets: [{data: graphData.data, label: 'Vote', backgroundColor: backgroundColors}], labels: graphData.labels}
        this.winningOptions = this.getHighestVotedOptionsForPoll(this.getMostRecentPoll._id)
      })
      .catch(error => error)
  }
}
</script>

<style>
.fa-trophy {
  color: #F6BD1C;
}
</style>