<template>
    <div class="container-fluid" :class="{'h-60': getActivePoll}">
      <div class="h-100 align-items-stretch justify-content-center" >
        <vote-for-option v-if="getActivePoll"></vote-for-option>
        <selected-options v-else-if="isCurrentPollInNomination"></selected-options>
        <results v-else></results>
      </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import queries from '@/api'
import isCurrentPollInNomination from '@/components/Home/VoteForOption'
import Results from '@/components/Results/Results'
import InfoFooter from '@/components/Home/InfoFooter'


export default {
    name:'Home',
    components: {
        isCurrentPollInNomination,
        Results,
        InfoFooter
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
        ...mapGetters('poll', ['getActivePoll', 'isCurrentPollInNomination'])
    },
    methods: {
        ...mapActions('option', {
            getOptions: 'find'
        }),
        ...mapActions('time', {startTimer: 'start'})
    },
    created: function () {
      this.startTimer()
      queries.getCurrentPoll()
      .then(response => {
          if (response.total > 0){
            this.pollId = response.data[0]._id
            return this.getOptions({query: {poll_id: this.pollId}})
            } else {
              return Promise.resolve()
            }
        })
        .catch(error => console.error(error))
    }
}
</script>

<style scoped>

</style>
