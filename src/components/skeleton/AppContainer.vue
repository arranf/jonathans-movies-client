<template>
  <v-app id="app-container">
    <v-navigation-drawer v-model="showNavigation" temporary fixed>
      <drawer-list/> 
    </v-navigation-drawer>
    <toolbar @toggleNavigation="showNavigation = !showNavigation" />
    <progress-bar class="mt-0 w-100" />
    <v-content>
      <v-container fluid fill-height>
          <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
            <router-view />
        </v-flex>
          </v-layout>
      </v-container>
    </v-content>
  </v-app>
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