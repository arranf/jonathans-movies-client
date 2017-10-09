<template>
    <footer class="h-100">
        <div class="container-fluid" >
            <div class="row equal-height" v-if="user && getActivePoll">
                <div class="col-6">
                  <div class="card">
                      <div class="card-body d-flex align-items-center justify-content-center">
                          <p class="card-text text-center" v-if="isCurrentPollInNomination">{{remainingTimeInNominationWordsForCurrentPoll}}</p>
                          <p class="card-text text-center" v-else-if="isCurrentPollInVoting">{{remainingTimeWordsForCurrentPoll}}</p>
                      </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="card" :class="displayError"  v-if="votes && polls && getActivePoll">
                      <div class="card-body d-flex align-items-center justify-content-center">
                          <p class="card-text text-center"><span class="font-weight-bold">{{remainingVotes}}</span> <br/> Votes Left</p>
                      </div>
                  </div>
                </div>
            </div>

          <div >
            <ul class="list-inline list-unstyled">
              <li class="list-inline-item"><router-link to="/create" v-if="user && user.isAdmin && !getActivePoll">Create Poll</router-link></li>
              <li class="list-inline-item"><router-link to="/nominate" v-if="user">Nominate</router-link></li>
              <li class="list-inline-item"><button type="button" class="btn btn-link" v-if="user && user.isAdmin && getActivePoll" @click.prevent="stopPoll()">Stop Poll</button></li>
              <li class="list-inline-item"><button v-if="user" class="btn btn-link" role="button" @click="logoutAndRedirect()">Logout</button></li>
            </ul>
          </div>
        </div>
    </footer>
</template>

<script>
import {mapGetters, mapState, mapActions} from 'vuex'
import utils from '@/utils'
import queries from '@/api'
import router from '@/router'

require('csshake/dist/csshake-horizontal.min.css')

export default {
  name: 'InfoFooter',
  computed: {
      ...mapGetters('vote', {votes: 'list'}),
      ...mapGetters('poll', {polls: 'find'}),
      ...mapGetters('vote', {findVotesInStore: 'find'}),
      ...mapGetters('poll', ['getActivePoll', 'remainingTimeWordsForCurrentPoll', 'isCurrentPollInNomination', 'isCurrentPollInVoting', 'remainingTimeInNominationWordsForCurrentPoll']),
      ...mapGetters('vote', {remainingVotes: 'votesRemaining'}),
      ...mapState('auth', ['user']),
      ...mapGetters('errors', ['shouldShowErrorForExceedVote']),
      displayError:  function() {
         if (this.shouldShowErrorForExceedVote) {
           return {
          'shake-horizontal': true, 
          'shake-constant': true,
          'border': true,
          'border-danger': true,
          'text-danger': true
          }
        } else {
          return {}
        }
      }
  },
  methods: {
      ...mapActions('poll', {updatePoll: 'patch'}),
      ...mapActions('auth', ['logout']),
      stopPoll: function () {
        const currentTime = parseInt(new Date().getTime())
        const data = {'endDateTime': currentTime}
        this.updatePoll([this.getActivePoll._id, data, {}])
      },
      logoutAndRedirect: function () {
        this.logout()
        router.push('/')
      }
  },
  beforeUpdate: function() {
      if (this.user && !this.gotVoteandPolls && this.getActivePoll) {
        queries.getCurrentPoll()
        .then(queries.getVotesForCurrentPoll())
        .then(this.gotVoteandPolls = true)
      }
  }
}
</script>

<style scoped>
footer {
  padding-top: 0.5rem;
  flex-shrink: 0;
  background-color: #efefef;
  text-align: center;
}

.heart {
    color: red;
}
</style>
