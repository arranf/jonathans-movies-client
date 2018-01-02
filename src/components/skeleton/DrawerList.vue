<template>
  <md-list>
    <md-list-item v-if="user && user.isAdmin && !getActivePoll" to="/create">
      <md-icon>create</md-icon>
      <span class="md-list-item-text">Create Poll</span>
    </md-list-item>

    <md-list-item v-if="this.$route.name !== 'Movies'" to="/movies">
      <md-icon>movie</md-icon>
      <span class="md-list-item-text">Movies</span>
    </md-list-item>

    <md-list-item v-if="user" @click="logoutAndRedirect()">
      <md-icon>exit_to_app</md-icon>
      <span class="md-list-item-text">Logout</span>
    </md-list-item>
  </md-list>
</template>

<script>
import {mapGetters, mapState, mapActions} from 'vuex'

export default {
  name: 'DrawerList',
  computed: {
    ...mapGetters('poll', ['getActivePoll']),
    ...mapState('auth', ['user'])
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
