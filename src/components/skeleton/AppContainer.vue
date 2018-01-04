<template>
<div class="" style="height:100vh" id="app-container">
  <!-- <div class="d-flex flex-column" style="height:100vh" id="app-container"> -->
    <md-app >
      <md-app-toolbar class="md-primary">
        <toolbar @toggleNavigation="showNavigation = !showNavigation" />
      </md-app-toolbar>
      <md-app-drawer :md-active.sync="showNavigation">
        <drawer-list @close="showNavigation = false" />
      </md-app-drawer>
      <md-app-content class="content-height">
        <router-view />
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import DrawerList from '@/components/skeleton/DrawerList'
import Toolbar from '@/components/skeleton/Toolbar'

export default {
  name: 'app',
  data: () => ({
    showNavigation: false
  }),
  components: {
    DrawerList,
    Toolbar
  }
}
</script>

<style lang="scss">
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
