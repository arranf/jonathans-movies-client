<template>
  <div>
    <h1>{{winningOptions}}</h1>
   <pie-chart :chart-data="datacollection" :options="{responsive: true, maintainAspectRatio: false}"></pie-chart>
  </div>
</template>

<script>
import PieChart from './PieChart.js'
import {mapActions, mapGetters} from 'vuex'
import utils from '@/utils'
import constants from '@/constants'

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
    ...mapGetters('vote', ['getGraphData']),
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
    this.getPolls()
    // TODO Make this a smart query
    .then(data => this.getVotes({}))
    .then((data) => {
        const graphData = this.getGraphData(this.getMostRecentPoll._id)
        const backgroundColors = [];
        graphData.labels.forEach(label => backgroundColors.push(utils.selectRandom(constants.colors['800'])))
        this.datacollection = {datasets: [{data: graphData.data, label: 'Vote', backgroundColor: backgroundColors}], labels: graphData.labels}
        this.winningOptions = utils.getHighestVotedOptions(graphData.data)
      })
      .catch(error => error)
  }
}
</script>

