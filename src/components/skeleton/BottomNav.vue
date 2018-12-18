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
        <icon v-once>home</icon>
      </v-btn>

      <v-btn
      color="primary"
        flat
        value="discover"
        to="/discover"
      >
        <span>Discover</span>
        <icon v-once>search</icon>
      </v-btn>

      <v-btn
      color="primary"
        flat
        value="movies"
        to="/movies"
      >
        <span>All Movies</span>
        <icon v-once>movie</icon>
      </v-btn>
    </v-bottom-nav>
</template>

<script>
import Icon from '@/components/Lite/Icon'

export default {
  name: 'BottomNav',
  components: {
    Icon
  }
}
</script>
