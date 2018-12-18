<template>
<!-- TODO: Check over this CSS -->
<div class="d-flex flex-column align-items-center justify-items-center" style="width: 100%">
  <!-- TODO: Refactor to Use a Simpler Getter -->
  <div v-if="getMostRecentPoll && areVotes" style="width: 100%">
    <h1 class="md-headline text-xs-center">Results</h1>
    <bar-chart style="padding-top: 3em" :data="results" :numberOfVoters="getNumberOfUniqueVoters()" :colors="backgroundColors"/>
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
import { mapGetters, mapActions } from 'vuex'
import { getUniqueColors } from '@/utils'
import { getCurrentPoll, getVotesForMostRecentPoll } from '@/api'

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
  methods: {
    ...mapActions('loading', ['setLoading', 'setLoaded'])
  },
  computed: {
    ...mapGetters('vote', ['getGraphData', 'areVotesForPoll', 'getNumberOfUniqueVoters']),
    ...mapGetters('poll', ['getMostRecentPoll']),
    results () {
      return this.getGraphData(this.getMostRecentPoll)
    },
    areVotes () {
      if (this.getMostRecentPoll) {
        return this.areVotesForPoll(this.getMostRecentPoll)
      }
      return false
    }
  },
  async mounted () {
    try {
      await this.setLoading('Home') // this is required because 'Home' has two possible components that load data
      await getCurrentPoll()
      await getVotesForMostRecentPoll(this.getMostRecentPoll)
      this.backgroundColors = getUniqueColors(this.getMostRecentPoll.options.length, '500')
      this.emptyStateAllowed = true
      this.setLoaded('Home')
    } catch (error) {
      console.error(error)
    }
  }
}
</script>
