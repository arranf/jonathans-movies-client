<template>
    <footer class="h-100">
        <div class="container-fluid" >
            <div class="row" v-if="user && isActivePoll">
                <div class="col">
                    <div class="card-deck">
                        <div class="card">
                            <div class="card-body">
                                <p class="card-text" v-if="isActivePoll">{{remainingTimeWordsForCurrentPoll}}</p>
                            </div>
                        </div>

                        <div class="card" :class="{'shake-horizontal': shouldShowErrorForExceedVote, 'shake-constant': shouldShowErrorForExceedVote}"  v-if="votes && polls && isActivePoll">
                            <div class="card-body">
                                <p class="card-text"><strong>{{remainingVotes}}</strong> Votes Remaining</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

          <div class="row d-flex">
            <div class="col mt-4 align-self-end invisible">
                Hidden
              </div>
              <div class="col mt-4 align-self-center">
                <p>Made with <i class="fa fa-heart heart" aria-hidden="true"></i> <span class="sr-only">love</span> by <a href="https://arranfrance.com" target="_blank">Arran</a> and Joel.</p>
                <router-link to="/create" v-if="user && user.isAdmin && !isActivePoll">Create Poll</router-link>
                <div class="">
                  <button type="button" class="btn btn-link" v-if="user && user.isAdmin && isActivePoll" @click.prevent="stopPoll()">Stop Poll</button>
                </div>
                <button v-if="user" class="btn btn-link" role="button" @click="logout()">Logout</button>
              </div>
              <div class="col mt-4 align-self-end">
                Version 1.0 <span class="badge badge-dark">BETA</span>
              </div>
          </div>
        </div>
    </footer>
</template>

<script>
import {mapGetters, mapState, mapActions} from 'vuex'
import utils from '@/utils'
import queries from '@/api'

require('csshake/dist/csshake-horizontal.min.css')

export default {
  name: 'InfoFooter',
  computed: {
      ...mapGetters('vote', {votes: 'list'}),
      ...mapGetters('poll', {polls: 'find'}),
      ...mapGetters('vote', {findVotesInStore: 'find'}),
      ...mapGetters('poll', ['getActivePoll', 'isActivePoll', 'remainingTimeWordsForCurrentPoll']),
      ...mapGetters('vote', {remainingVotes: 'votesRemaining'}),
      ...mapState('auth', ['user']),
      ...mapActions('auth', ['logout']),
      ...mapGetters('errors', ['shouldShowErrorForExceedVote'])
  },
  methods: {
      ...mapActions('poll', {updatePoll: 'patch'}),
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
      if (this.user && !this.gotVoteandPolls && this.getActivePoll){
        queries.getCurrentPoll()
        .then(queries.getVotesForCurrentPoll())
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
