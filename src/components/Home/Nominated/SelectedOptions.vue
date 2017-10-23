<template>
  <div class="d-flex scroll flex-row-reverse" v-if="getOptionsForCurrentPoll">
    <template v-for="option in getOptionsForCurrentPoll">
      <option-preview class="scroll-item" :key="option._id" :option="option"></option-preview>
    </template>
  </div>
</template>

<script>
import OptionPreview from './OptionPreview'
import queries from '@/api'
import {mapGetters} from 'vuex'

export default {
  name: 'SelectedOptions',
  components: {
    OptionPreview
  },
  computed: {
    ...mapGetters('option', ['getOptionsForCurrentPoll'])
  }
}
</script>

<style scoped>
.scroll {
  overflow: auto;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.scroll-item {
  flex: 0 0 auto;
}
</style>
