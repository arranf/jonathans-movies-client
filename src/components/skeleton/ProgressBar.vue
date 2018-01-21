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
  .progress-linear {
    margin-top: 0;
    position: fixed;
    z-index: 5;
  }
</style>
