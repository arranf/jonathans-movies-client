<template>
    <footer class="h-100">
        <div class="container-fluid" v-if="user && isActivePoll">
            <div class="row">
                <div class="col">
                    <div class="card-deck">
                        <div class="card">
                            <div class="card-body">
                                <p class="card-text" v-if="isActivePoll">{{remainingTimeWordsForCurrentPoll}}</p>
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
              <router-link to="/admin" v-if="user && user.isAdmin && !isActivePoll">Create Poll</router-link>
              <button type="button" class="btn btn-link" v-if="user && user.isAdmin && isActivePoll" @click.prevent="stopPoll()">Stop Poll</button>
            </div>
        </div>
    </footer>
</template>

<script>
import {mapGetters, mapState, mapActions} from 'vuex'
import utils from '@/utils'
import queries from '@/api'

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
      ...mapActions('poll', {getPolls: 'find', updatePoll: 'patch'}),
      timeRemaining: function() {
        if (this.isActivePoll) {
          return 'Poll closes in ' + utils.humanizeTimeToNow(this.getActivePoll.endDateTime)
        }
        return 'No Current Poll'
      },
      stopPoll: function () {
        const currentTime = parseInt(new Date().getTime())
        const data = {'endDateTime': currentTime}
        this.updatePoll([this.getActivePoll._id, data, {}])
      }
  },
  beforeUpdate: function() {
      if (this.user && !this.gotVoteandPolls){
        queries.getCurrentPoll()
        .then(this.getVotes({query: {}}))
        .then(this.gotVoteandPolls = true)
      }
  }
}
</script>

<style scoped>
footer {
  /* position: absolute;
  right: 0;
  bottom: 0;
  left: 0; */
  flex-shrink: 0;
  padding: 1rem;
  background-color: #efefef;
  text-align: center;
}

.heart {
    color: red;
}
</style>
