<template>
<!-- :class="{'h-50': getActivePoll && !isCurrentPollInNomination}" -->
    <div id="home-container" style="max-height: 100%">
      <div>
        <selected-options v-if="isCurrentPollInNomination" />
        <vote-for-option class=" align-items-stretch justify-content-center" v-else-if="getActivePoll"></vote-for-option>
        <results v-else></results>
      </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import queries from '@/api'
import VoteForOption from '@/components/Home/VoteForOption'
import Results from '@/components/Results/Results'
import SelectedOptions from './Nominated/SelectedOptions'

export default {
  name: 'Home',
  components: {
    VoteForOption,
    Results,
    SelectedOptions
  },
  data () {
    return {
      pollId: null
    }
  },
  computed: {
    ...mapGetters('poll', {
      polls: 'list'
    }),
    ...mapGetters('option', {
      options: 'list'
    }),
    ...mapGetters('option', {
      findOptions: 'find'
    }),
    ...mapGetters('poll', ['getActivePoll', 'isCurrentPollInNomination'])
  },
  methods: {
    ...mapActions('time', {startTimer: 'start'})
  },
  created: function () {
    // TODO Move to router
    // Sync client time with server time
    this.startTimer()

    // TODO move this to the router
    queries.getCurrentPoll()
      .then(response => {
        if (response.total > 0) {
          this.pollId = response.data[0]._id
          const existingOptions = this.findOptions({query: {poll_id: this.pollId}})
          if (existingOptions.total <= 2) {
            queries.getOptionsForMostRecentPoll(this.pollId).then(response => console.log('Got options'))
          }
        }
      })
      .catch(error => console.error(error))
  }
}
</script>