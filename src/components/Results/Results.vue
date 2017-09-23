<template>
  <div>
    <h1 class="text-center"><i class="fa fa-trophy" aria-hidden="true"></i>  {{winningOptions.length > 1 ? winningOptions.slice(0, winningOptions.length - 1).join(', ') + " and " + winningOptions.slice(-1) : winningOptions[0]}}</h1>
   <pie-chart :chart-data="datacollection" :options="{responsive: true, maintainAspectRatio: false}"></pie-chart>
  </div>
</template>

<script>
import PieChart from './PieChart.js'
import {mapActions, mapGetters} from 'vuex'
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
    ...mapGetters('poll', ['getMostRecentPoll']),
    ...mapGetters('option', {getOption: 'get'})
  },
  methods: {
    ...mapActions('poll', {
      getPolls: 'find'
    }),
    ...mapActions('vote', {
      getVotes: 'find'
    })
  },
  created () {
    
  },
  mounted () {
    queries.getCurrentPoll()
    // TODO Make this a smart query
    .then(data => this.getVotes({}))
    .then((data) => {
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