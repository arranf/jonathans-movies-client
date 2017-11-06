<template>
  <div class="d-flex scroll flex-row" v-if="getOptionsForCurrentPoll">
    <div v-if="nominationsRemaining > 0" class="card w-60 m-4" style="flex: 0 0 auto">
      <div class="card-body">
        <h4 class="card-title">Nominate Something</h4>
        <p class="card-text">You've got {{nominationsRemaining}} nominations. Why not pick a movie?</p>
        <router-link :to="'movies'" class="btn btn-primary btn-sm">Nominate a movie</router-link>
      </div>
    </div>
    <template v-for="option in currentPollOptions">
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
    ...mapGetters('option', ['getOptionsForCurrentPoll', 'nominationsRemaining']),
    ...mapGetters('poll', ['getActivePoll']),
    currentPollOptions: function () {
      return this.getOptionsForCurrentPoll.reverse()
    }
  },
  created () {
    queries.getOptionsForMostRecentPoll(this.getActivePoll._id)
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
