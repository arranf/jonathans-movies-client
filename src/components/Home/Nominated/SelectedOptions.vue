<template>
<div class="">
  <div v-if="currentPollOptions.length === 0" class="empty-state-container">
    <v-icon size="100px" class="mb-2">playlist_add</v-icon>
    <h1 class="display-1 mb-1">Nominate a Movie</h1>
    <p class="empty-state-description">{{`You\'ve got, ${nominationsRemaining} nominations left. Use them wisely!`}}</p>
    <v-btn color="primary" @click="$router.push('/movies')">Nominate a movie</v-btn>
  </div>

  <div class="d-flex flex-column" v-if="getOptionsForCurrentPoll && currentPollOptions && currentPollOptions.length > 0" >
    <h2 class="md-display-1 text-center">Nominations</h2>
    <div class="scroll align-self-center">
      <option-preview v-for="option in currentPollOptions" class="scroll-item" :key="option._id" :option="option"></option-preview>
    </div>
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