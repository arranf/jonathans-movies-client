<template>
  <div class="d-flex flex-column" style="height:100vh">
    <md-app >
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="showNavigation = true">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">Jonathan's Movies</span>
      </md-app-toolbar>
      <md-app-drawer :md-active.sync="showNavigation">
        <drawer-list @close="showNavigation = false" />
      </md-app-drawer>
      <md-app-content style="height:90vh">
        <router-view />
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import DrawerList from '@/components/DrawerList'

export default {
  name: 'app',
  data: () => ({
    showNavigation: false
  }),
  components: {
    DrawerList
  }
}
</script>
