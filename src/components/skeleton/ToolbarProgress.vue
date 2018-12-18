<template>
  <progress-linear class="progress-linear" :color="color" :progress="percentageOfCurrentPhaseComplete" />
</template>

<script>
import { mapGetters } from 'vuex'
import ProgressLinear from '@/components/common/ProgressLinear'

const dangerMark = 80

export default {
  name: 'ToolbarProgress',
  components: {
    ProgressLinear
  },
  computed: {
    ...mapGetters('poll', ['percentageOfCurrentPhaseComplete']),
    color () {
      if (this.percentageOfCurrentPhaseComplete < dangerMark) {
        return 'secondary'
      }
      return 'red'
    }
  }
}
</script>

<style>
.progress-linear {
  margin-top: 0 !important;
  position: fixed !important;
  z-index: 5 !important;
}
</style>
