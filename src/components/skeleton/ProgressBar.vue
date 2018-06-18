<template>
  <v-progress-linear :color="color" v-if="getActivePoll" v-model="percentageOfCurrentPhaseComplete" />
</template>

<script>
import {VProgressLinear} from 'vuetify'
import {mapGetters} from 'vuex'

const dangerMark = 80

export default {
  name: 'ProgressBar',
  components: {
    VProgressLinear
  },
  computed: {
    ...mapGetters('poll', ['getActivePoll', 'percentageOfCurrentPhaseComplete']),
    color () {
      if (this.percentageOfCurrentPhaseComplete < dangerMark) {
        return 'secondary'
      }
      return 'red'
    }
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
