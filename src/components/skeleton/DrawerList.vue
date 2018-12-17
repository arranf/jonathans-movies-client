<template>
<div>
  <v-toolbar flat>
    <v-list>
      <v-list-tile>
        <v-list-tile-title class="title">
          Navigation
        </v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-toolbar>
  <v-divider></v-divider>

  <v-list>
    <!-- home -->
    <v-list-tile v-if="user" to="/home">
      <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Home</v-list-tile-title>
        </v-list-tile-content>
    </v-list-tile>

    <!-- create poll -->
    <v-list-tile v-if="user && user.isAdmin && !getActivePoll" to="/create">
      <v-list-tile-action>
          <v-icon>create</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Create Poll</v-list-tile-title>
        </v-list-tile-content>
    </v-list-tile>

    <!--  discover-->
    <v-list-tile v-if="user" to="/discover">
      <v-list-tile-action>
          <v-icon>search</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Discover</v-list-tile-title>
        </v-list-tile-content>
    </v-list-tile>

    <!-- all movies -->
    <v-list-tile v-if="user" to="/movies">
      <v-list-tile-action>
          <v-icon>movie</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>All Movies</v-list-tile-title>
        </v-list-tile-content>
    </v-list-tile>

    <!-- add to library -->
    <v-list-tile v-if="user && user.isAdmin" to="/add">
      <v-list-tile-action>
          <v-icon>playlist_add</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Add to Collection</v-list-tile-title>
        </v-list-tile-content>
    </v-list-tile>

    <v-list-tile v-if="user && user.isAdmin" to="/collection">
      <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Switch Active Collection</v-list-tile-title>
        </v-list-tile-content>
    </v-list-tile>

    <!-- logout -->
    <v-list-tile v-if="user" to="/logout">
      <v-list-tile-action>
          <v-icon>exit_to_app</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Logout</v-list-tile-title>
        </v-list-tile-content>
    </v-list-tile>
  </v-list>

  <v-toolbar v-if="getActivePoll" flat>
    <v-list>
      <v-list-tile>
        <v-list-tile-title class="title">
          Poll Information
        </v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-toolbar>
  <v-divider v-if="getActivePoll && user"></v-divider>

  <v-list v-if="getActivePoll && user">
    <v-list-tile v-if="isCurrentPollInNomination">
        <v-list-tile-content>
          <v-list-tile-title>{{remainingNominations}} Nomination{{remainingNominations > 1 ? 's' : ''}} Left</v-list-tile-title>
        </v-list-tile-content>
    </v-list-tile>
    <v-list-tile v-else-if="isCurrentPollInVoting">
        <v-list-tile-content>
          <v-list-tile-title>{{remainingVotes}} Vote{{remainingVotes > 1 ? 's' : ''}} Left</v-list-tile-title>
        </v-list-tile-content>
    </v-list-tile>

    <v-list-tile v-if="isCurrentPollInNomination">
        <v-list-tile-content>
          <v-list-tile-title>{{remainingTimeInNominationWordsForCurrentPoll}}</v-list-tile-title>
        </v-list-tile-content>
    </v-list-tile>
    <v-list-tile v-else-if="isCurrentPollInVoting">
        <v-list-tile-content>
          <v-list-tile-title>{{remainingTimeWordsForCurrentPoll}}</v-list-tile-title>
        </v-list-tile-content>
    </v-list-tile>
  </v-list>
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DrawerList',
  props: {
    user: {
      type: Object
    }
  },
  computed: {
    ...mapGetters('poll', [
      'getActivePoll',
      'remainingTimeWordsForCurrentPoll',
      'isCurrentPollInNomination',
      'isCurrentPollInVoting',
      'remainingTimeInNominationWordsForCurrentPoll'
    ]),
    ...mapGetters('vote', { remainingVotes: 'votesRemaining' }),
    ...mapGetters('option', { remainingNominations: 'nominationsRemaining' })
  }
}
</script>
