<template>
  <div>
    <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">Navigation</span>
    </md-toolbar>
    <md-list>
      <md-list-item v-if="user" to="/home">
        <md-icon>home</md-icon>
        <span class="md-list-item-text">Home</span>
      </md-list-item>

      <md-list-item v-if="user && user.isAdmin && !getActivePoll" to="/create">
        <md-icon>create</md-icon>
        <span class="md-list-item-text">Create Poll</span>
      </md-list-item>

      <md-list-item v-if="user" to="/movies">
        <md-icon>movie</md-icon>
        <span class="md-list-item-text">Movies</span>
      </md-list-item>

      <md-list-item v-if="user && user.isAdmin" to="/add">
        <md-icon>library_add</md-icon>
        <span class="md-list-item-text">Add to Collection</span>
      </md-list-item>

      <md-list-item v-if="user" @click="logoutAndRedirect()">
        <md-icon>exit_to_app</md-icon>
        <span class="md-list-item-text">Logout</span>
      </md-list-item>
    </md-list>

    <md-toolbar v-if="getActivePoll" class="md-transparent" md-elevation="0">
        <!-- <span class="md-title">Jonathan's Movies</span> -->
    </md-toolbar>
    <md-divider />
    <md-list  v-if="getActivePoll">
      <md-list-item v-if="isCurrentPollInNomination" >
        <md-icon>format_list_numbered</md-icon>
        <span class="md-list-item-text">{{remainingNominations}} Nominations Left</span>
      </md-list-item>
      <md-list-item v-else-if="isCurrentPollInVoting" >
        <md-icon>format_list_numbered</md-icon>
        <span class="md-list-item-text">{{remainingVotes}} Votes Left</span>
      </md-list-item>
      <md-list-item  v-if="isCurrentPollInNomination">
        <md-icon>timelapse</md-icon>
        <span class="md-list-item-text">{{remainingTimeInNominationWordsForCurrentPoll}}</span>        
      </md-list-item>
      <md-list-item  v-else-if="isCurrentPollInVoting">
        <md-icon>timelapse</md-icon>
        <span class="md-list-item-text">{{remainingTimeWordsForCurrentPoll}}</span>
      </md-list-item>
    </md-list>

    
  </div>
</template>

<script>
import {mapGetters, mapState, mapActions} from 'vuex'

export default {
  name: 'DrawerList',
  computed: {
    ...mapGetters('poll', ['getActivePoll', 'remainingTimeWordsForCurrentPoll', 'isCurrentPollInNomination', 'isCurrentPollInVoting', 'remainingTimeInNominationWordsForCurrentPoll']),
    ...mapState('auth', ['user']),
    ...mapGetters('vote', {remainingVotes: 'votesRemaining'}),
    ...mapGetters('option', {remainingNominations: 'nominationsRemaining'})
  },
  methods: {
    ...mapActions('auth', ['logout']),
    logoutAndRedirect: function () {
      this.$emit('close')
      this.logout()
      this.$router.push({path: '/'})
    }
  }
}
</script>
