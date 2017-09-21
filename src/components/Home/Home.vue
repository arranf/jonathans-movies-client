<template>
    <div class="container-fluid h-100">
        <div class="row d-flex h-75 align-items-stretch">
            <div class="col" v-if="isActivePoll">
              <select-movie :movies="options" :pollId="this.pollId"></select-movie>
            </div>
            <div class="col" v-else>
              <results></results>
            </div>
        </div>
        <div class="row h-25">
            <div class="col">
                <info-footer></info-footer>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import queries from '@/api'
import SelectMovie from '@/components/Home/SelectMovie'
import Results from '@/components/Results/Results'
import InfoFooter from '@/components/Home/InfoFooter'


export default {
    name:'Home',
    components: {
        SelectMovie,
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
