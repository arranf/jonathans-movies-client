

<template>
  <md-list>
    <md-list-item v-if="user.isAdmin && !getActivePoll" to="/create">
      <md-icon>create</md-icon>
      <span class="md-list-item-text">Create Poll</span>
    </md-list-item>

    <md-list-item v-if="user.isAdmin && isCurrentPollInVoting" to="/movies">
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
import { MdListItem, MdList, MdIcon } from 'vue-material/dist/components'

export default {
  name: 'DrawerList',
  components: {
    MdList,
    MdListItem,
    MdIcon
  }
}
</script>
