<template>
  <v-app id="app-container">
    <v-navigation-drawer app v-model="showNavigation" temporary>
      <drawer-list/> 
    </v-navigation-drawer>
    <toolbar @toggleNavigation="showNavigation = !showNavigation" />
    
    <v-content>
      <progress-bar  />
      <v-container fluid fill-height>
          <v-layout align-center justify-center>
        <v-flex xs12 sm8 md8>          
            <router-view />            
        </v-flex>
        
          </v-layout>
          
      </v-container>
      <bottom-nav v-if="user"/>
    </v-content>
    <snackbar />
  </v-app>
</template>

<script>
import {mapState} from 'vuex'

import DrawerList from '@/components/skeleton/DrawerList'
import Toolbar from '@/components/skeleton/Toolbar'
import ProgressBar from '@/components/skeleton/ProgressBar'
import Snackbar from '@/components/skeleton/Snackbar'
import BottomNav from '@/components/skeleton/BottomNav'

export default {
  name: 'app',
  data: () => ({
    showNavigation: false
  }),
  components: {
    DrawerList,
    Toolbar,
    ProgressBar,
    Snackbar,
    BottomNav
  },
  computed: {
    ...mapState('auth', ['user'])
  }
}
</script>