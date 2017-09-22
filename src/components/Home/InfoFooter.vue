<template>
    <footer>
        <div class="container-fluid" v-if="user && isActivePoll">
            <div class="row">
                <div class="col">
                    <div class="card-deck">
                        <div class="card">
                            <div class="card-body">
                                <p class="card-text" v-if="polls">{{timeRemainingWords}}</p>
                            </div>
                        </div>

                        <div class="card"  v-if="votes && polls && isActivePoll">
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
                <router-link to="/admin" v-if="user.isAdmin">Go to Admin Page</router-link>
            </div>
        </div>
    </footer>
</template>

<script>
import {mapGetters, mapState, mapActions} from 'vuex'
import utils from '@/utils'

export default {
  name: 'InfoFooter',
  computed: {
      ...mapGetters('vote', {votes: 'list'}),
      ...mapGetters('poll', {polls: 'find'}),
      ...mapGetters('vote', {findVotesInStore: 'find'}),
      ...mapGetters('poll', ['getActivePoll', 'isActivePoll', 'remainingTimeWordsForCurrentPoll']),
      ...mapGetters('vote', {remainingVotes: 'votesRemaining'}),
      ...mapState('auth', ['user'])
  },
  methods: {
      ...mapActions('vote', {getVotes: 'find'}),
      ...mapActions('poll', {getPolls: 'find'})
  },
  beforeUpdate: function() {
      if (this.user && !this.gotVoteandPolls){
        this.getPolls({query:{}})
        .then(this.getVotes({query: {}}))
        .then(this.gotVoteandPolls = true)
      }
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
