<template>
  <md-progress-bar v-if="getActivePoll" class="md-accent bottom" md-mode="determinate" :md-value="percentageOfCurrentPhaseComplete" />
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
