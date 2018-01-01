<template>
  <div class="page-container" style="height:100vh">
    <md-app>
      <md-app-drawer>
        <drawer-list />
      </md-app-drawer>
      <md-app-content>
        <router-view />
      </md-app-content>
    </md-app>
  </div>
</template>

<script>

import { MdApp } from 'vue-material/dist/components'
import DrawerList from '@/components/DrawerList'

export default {
  name: 'app',
  components: {
    DrawerList,
    MdApp
  }
}
</script>
