<template>
<div id="app-container">
    <md-app>
      <md-app-toolbar class="md-primary">
        <toolbar @toggleNavigation="showNavigation = !showNavigation" />
      </md-app-toolbar>
      <md-app-drawer :md-active.sync="showNavigation">
        <drawer-list @close="showNavigation = false" />
      </md-app-drawer>
      <md-app-content class="content-height d-flex flex-column">
        <!-- <progress-bar v-if="$route.path === '/movies'" /> -->
        <router-view />
        <progress-bar />
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import DrawerList from '@/components/skeleton/DrawerList'
import Toolbar from '@/components/skeleton/Toolbar'
import ProgressBar from '@/components/skeleton/ProgressBar'

export default {
  name: 'app',
  data: () => ({
    showNavigation: false
  }),
  components: {
    DrawerList,
    Toolbar,
    ProgressBar
  }
}
</script>

<style lang="scss">
// Can't make this scoped
  @import "../../../node_modules/vue-material/src/components/MdLayout/mixins.scss";

  $md-toolbar-height: 64px;
  $md-toolbar-height-portrait: 56px;
  $md-toolbar-height-landscape: 48px;

  $md-content-height: calc(100vh - #{$md-toolbar-height});
  $md-content-height-landscape: calc(100vh - #{$md-toolbar-height-landscape});
  $md-content-height-portrait: calc(100vh - #{$md-toolbar-height-portrait});

  .content-height {
    min-height: $md-content-height;
    
    @include md-layout-small {
      min-height: $md-content-height-landscape;
    }
    @include md-layout-xsmall {
      min-height: $md-content-height-portrait;
    }
  }
</style>
