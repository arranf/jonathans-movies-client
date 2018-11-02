<template>
    <v-bottom-nav
      :value="true"
      fixed
      :app="true"
    >
      <v-btn
      color="primary"
        flat
        value="home"
        to="/home"
      >
        <span>Home</span>
        <v-icon>home</v-icon>
      </v-btn>

      <v-btn
      color="primary"
        flat
        value="discover"
        to="/discover"
      >
        <span>Discover</span>
        <v-icon>search</v-icon>
      </v-btn>

      <v-btn
      color="primary"
        flat
        value="movies"
        to="/movies"
      >
        <span>All Movies</span>
        <v-icon>movie</v-icon>
      </v-btn>
    </v-bottom-nav>
</template>

<script>
// import { VIcon, VBtn, VBottomNav } from 'vuetify'
export default {
  Name: 'Bottom Nav'
}
</script>
