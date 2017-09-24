<template>
    <div class="container-fluid" :class="{'h-60': isActivePoll}">
      <div class="h-100 align-items-stretch justify-content-center" >
        <select-option v-if="isActivePoll"></select-option>
        <results v-else></results>
      </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import queries from '@/api'
import SelectOption from '@/components/Home/SelectOption'
import Results from '@/components/Results/Results'
import InfoFooter from '@/components/Home/InfoFooter'


export default {
    name:'Home',
    components: {
        SelectOption,
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
        ...mapGetters('poll', ['getActivePoll', 'isActivePoll'])
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
