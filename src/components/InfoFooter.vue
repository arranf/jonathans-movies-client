<template>
    <footer class="h-100 bg-primary">
        <div class="container-fluid" >
            <div class="row equal-height" v-if="user && getActivePoll">
                <div class="col-6">
                  <div class="card">
                      <div class="card body d-flex align-items-center justify-content-center">
                          <p class="card-text text-center" v-if="isCurrentPollInNomination">{{remainingTimeInNominationWordsForCurrentPoll}}</p>
                          <p class="card-text text-center" v-else-if="isCurrentPollInVoting">{{remainingTimeWordsForCurrentPoll}}</p>
                      </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="card" :class="displayError"  v-if="votes && polls && getActivePoll">
                      <div class="card-body d-flex align-items-center justify-content-center">
                          <p v-if="isCurrentPollInNomination" class="card-text text-center"><span class="font-weight-bold">{{remainingNominations}}</span> <br/> Nominations Left</p>
                          <p v-else-if="isCurrentPollInVoting" class="card-text text-center"><span class="font-weight-bold">{{remainingVotes}}</span> <br/> Votes Left</p>
                      </div>
                  </div>
                </div>
            </div>

          <div >
            <ul v-if="user" class="list-inline list-unstyled footer-links">
              <li v-if="user.isAdmin && !getActivePoll" class="list-inline-item"><router-link to="/create">Create Poll</router-link></li>
              <li v-if="this.$route.name !== 'Movies'" class="list-inline-item"><router-link to="/movies">Movies</router-link></li>
              <li v-if="this.$route.name === 'Movies'" class="list-inline-item"><router-link to="/home">Back</router-link></li>
              <li v-if="user.isAdmin && isCurrentPollInVoting" class="list-inline-item"><button type="button" class="btn btn-link" @click.prevent="stopPoll()">Stop Poll</button></li>
              <li v-if="user.isAdmin && isCurrentPollInNomination" class="list-inline-item"><button type="button" class="btn btn-link" @click.prevent="stopNominations()">Stop Nominations</button></li>
              <li class="list-inline-item"><button class="btn btn-link" role="button" @click="logoutAndRedirect()">Logout</button></li>
            </ul>
          </div>
        </div>
    </footer>
</template>

<script>
import {mapGetters, mapState, mapActions} from 'vuex'
import queries from '@/api'
import router from '@/router'

export default {
  name: 'InfoFooter',
  computed: {
    ...mapGetters('vote', {votes: 'list'}),
    ...mapGetters('poll', {polls: 'find'}),
    ...mapGetters('poll', ['getActivePoll', 'remainingTimeWordsForCurrentPoll', 'isCurrentPollInNomination', 'isCurrentPollInVoting', 'remainingTimeInNominationWordsForCurrentPoll']),
    ...mapGetters('vote', {remainingVotes: 'votesRemaining'}),
    ...mapGetters('option', {remainingNominations: 'nominationsRemaining'}),
    ...mapGetters('time', ['getNow']),
    ...mapState('auth', ['user']),
    ...mapGetters('errors', ['shouldShowErrorForExceedVote']),
    displayError: function () {
      if (this.shouldShowErrorForExceedVote) {
        return {
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
      const currentTime = this.getNow
      const data = {'endDateTime': currentTime}
      this.updatePoll([this.getActivePoll._id, data, {}])
    },
    stopNominations: function () {
      const currentTime = this.getNow
      const oldTransitionTime = this.getActivePoll.pollTransitionDateTime
      const data = {
        'pollTransitionDateTime': currentTime,
        'endDateTime': this.getActivePoll.endDateTime - (oldTransitionTime - currentTime)
      }
      this.updatePoll([this.getActivePoll._id, data, {}])
    },
    logoutAndRedirect: function () {
      this.logout()
      router.push('/')
    }
  },
  beforeUpdate: function () {
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
  text-align: center;
}

.footer-links a, .footer-links button {
   color: #ffffff;
}
</style>
