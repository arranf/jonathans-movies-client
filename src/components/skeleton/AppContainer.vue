<template>
  <v-app id="app-container">
    <v-navigation-drawer v-model="showNavigation" app temporary>
      <drawer-list />
    </v-navigation-drawer>
    <toolbar @toggleNavigation="showNavigation = !showNavigation" />

    <v-content>
      <progress-bar />
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md8>
            <loading v-if="isLoading" />
            <router-view v-show="!isLoading" />
          </v-flex>
        </v-layout>
      </v-container>
      <bottom-nav v-if="user" />
    </v-content>
    <snackbar />
  </v-app>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import DrawerList from "@/components/skeleton/DrawerList";
import Toolbar from "@/components/skeleton/Toolbar";
import ProgressBar from "@/components/skeleton/ProgressBar";
import Snackbar from "@/components/skeleton/Snackbar";
import BottomNav from "@/components/skeleton/BottomNav";
import Loading from "@/components/skeleton/Loading";

export default {
  name: "App",
  components: {
    DrawerList,
    Toolbar,
    ProgressBar,
    Snackbar,
    BottomNav,
    Loading,
  },
  data: () => ({
    showNavigation: false,
  }),
  computed: {
    ...mapState("auth", ["user"]),
    ...mapGetters("loading", ["isLoading"]),
  },
};
</script>
