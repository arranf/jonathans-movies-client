<template>
    <div class="d-flex flex-column justify-content-center container-fluid" :class="{'h-60': getActivePoll && !isCurrentPollInNomination}">
      <div class="h-100 align-items-stretch justify-content-center" >

        <selected-options v-if="isCurrentPollInNomination"></selected-options>
        <vote-for-option v-else-if="getActivePoll"></vote-for-option>
        <results v-else></results>
      </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import queries from '@/api'
import VoteForOption from '@/components/Home/VoteForOption'
import Results from '@/components/Results/Results'
import InfoFooter from '@/components/InfoFooter'
import SelectedOptions from './Nominated/SelectedOptions'

export default {
    name:'Home',
    components: {
        VoteForOption,
        Results,
        InfoFooter,
        SelectedOptions
    },
    data() {
        return {
            pollId: null
        }
    },
    computed:{
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
      this.startTimer()
      queries.getCurrentPoll()
      .then(response => {
          if (response.total > 0){
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