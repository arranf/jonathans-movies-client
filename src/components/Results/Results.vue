<template>
   <pie-chart :chart-data="datacollection"></pie-chart>
</template>

<script>
import PieChart from './PieChart.js'
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'Results',
  components: {
    PieChart
  },
  data () {
    return {
      datacollection: null
    }
  },
  computed: {
    ...mapGetters('vote', ['getVotesByOption']),
    ...mapGetters('poll', ['getMostRecentPoll'])
  },
  methods: {
    ...mapActions('poll', {
      getPolls: 'find'
    }),
    getData: function(){
      this.getMostRecentPoll
      // .then(poll => this.getVotesByOption(poll._id))
      // .then(data => this.data = data)
      // const labels = getOptionLabel  s()
    }
  },
  created () {
    this.getPolls()
  },
  mounted () {
    this.getData()
  }
}
</script>

