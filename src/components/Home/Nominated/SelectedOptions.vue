<template>
<div>
  <h2>Nominations: </h2>
  <div class="d-flex scroll flex-row-reverse card-deck" v-if="getOptionsForCurrentPoll">
    <!-- <div class="scroll-item p-2 card mt-3">
      <div class="card-body">
        <h4 class="card-title">Why Not Nominate A Movie?</h4>
        <router-link to="/nominate" class="btn btn-primary">Suggest Your Favourite</router-link>
      </div>
    </div> -->
    <template  v-for="option in getOptionsForCurrentPoll">
      <option-preview class="scroll-item" :key="option._id" :option="option"></option-preview>
    </template>
  </div>
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
