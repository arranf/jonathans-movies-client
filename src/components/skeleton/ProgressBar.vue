<template>
  <v-progress-linear color="secondary" v-if="getActivePoll" v-model="percentageOfCurrentPhaseComplete" />
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'ProgressBar',
  computed: {
    ...mapGetters('poll', ['getActivePoll', 'percentageOfCurrentPhaseComplete'])
  }
}
</script>

<style scoped>
  .bottom {
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: 6;
  }
</style>
