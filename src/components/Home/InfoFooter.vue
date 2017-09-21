<template>
    <footer>
        <div class="container-fluid" v-if="user">
            <div class="row">
                <div class="col">
                    <div class="card-deck">
                        <div class="card">
                            <div class="card-body">
                                <p class="card-text" v-if="polls">{{timeRemainingWords}}</p>
                            </div>
                        </div>

                        <div class="card"  v-if="votes && polls && isActivePoll ">
                            <div class="card-body">
                                <p class="card-text"><strong>{{remainingVotes}}</strong> Votes Remaining</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col mt-4">
                <p>Made with <i class="fa fa-heart heart" aria-hidden="true"></i> <span class="sr-only">love</span> (and a lot of food from Spar) by Arran and Joel.</p>
            </div>
        </div>
    </footer>
</template>

<script>
import {mapGetters, mapState, mapActions} from 'vuex'
import utils from '@/utils'

export default {
  name: 'InfoFooter',
  data() {
      return {
          interval: null,
          timeRemainingWords: 'No Current Poll'
      }
  },
  computed: {
      ...mapGetters('vote', {votes: 'list'}),
      ...mapGetters('poll', {polls: 'find'}),
      ...mapGetters('vote', {findVotesInStore: 'find'}),
      ...mapGetters('poll', ['getActivePoll', 'isActivePoll']),
      ...mapGetters('vote', {remainingVotes: 'votesRemaining'}),
      ...mapState('auth', ['user'])
  },
  methods: {
      ...mapActions('vote', {getVotes: 'find'}),
      ...mapActions('poll', {getPolls: 'find'}),
      timeRemaining: function() {
        if (this.isActivePoll) {
          return 'Poll closes in ' + utils.humanizeTimeToNow(this.getActivePoll.endDateTime)
        }
        return 'No Current Poll'
      }
  },
  mounted: function() {
    this.interval = setInterval(function () {
      this.timeRemainingWords = this.timeRemaining()
    }.bind(this), 100)
  },
  beforeUpdate: function() {
      if (this.user && !this.gotVoteandPolls){
        this.getPolls({query:{}})
        .then(this.getVotes({query: {}}))
        .then(this.gotVoteandPolls = true)
      }
  },
  beforeDestroy: function (){
    window.clearInterval(this.interval)
  }
}
</script>

<style scoped>
footer {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1rem;
  background-color: #efefef;
  text-align: center;
}

.heart {
    color: red;
}
</style>
