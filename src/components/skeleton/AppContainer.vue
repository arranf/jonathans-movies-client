<template>
  <v-app id="app-container">
    <v-navigation-drawer app v-model="showNavigation" temporary>
      <drawer-list :user="user"/>
    </v-navigation-drawer>
    <toolbar @toggleNavigation="showNavigation = !showNavigation" :user="user" />

    <v-content>
      <progress-bar />
      <div class="container fluid fill-height">
        <div class="layout align-center justify-center">
          <div class="flex xs12 sm8 md8">
            <loading v-if="isLoading" />
            <router-view v-show="!isLoading" />
          </div>
        </div>
      </div>
      <bottom-nav v-if="user"/>
    </v-content>
    <snackbar />
  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import DrawerList from '@/components/skeleton/DrawerList'
import Toolbar from '@/components/skeleton/Toolbar'
import Loading from '@/components/common/Loading'
const ProgressBar = () => import('@/components/skeleton/ProgressBar')
const Snackbar = () => import('@/components/skeleton/Snackbar')
const BottomNav = () => import('@/components/skeleton/BottomNav')

export default {
  name: 'AppContainer',
  data: () => ({
    showNavigation: false
  }),
  components: {
    DrawerList,
    Toolbar,
    ProgressBar,
    Snackbar,
    BottomNav,
    Loading
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('loading', ['isLoading']),
    ...mapGetters('poll', ['getActivePoll'])
  }
}
</script>
