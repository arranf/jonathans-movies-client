<template>

  <div>
    <!-- loading -->
    <div class="d-flex">
      <v-progress-circular class="align-self-center" v-if="!loaded" indeterminate color="primary" />
    </div>

      <!-- nominations empty state -->
    <div v-if="isCurrentPollInNomination && currentPollOptions.length === 0" class="empty-state-container">
      <v-icon size="100px" class="mb-2">playlist_add</v-icon>
      <h1 class="display-1 mb-1">Nominate a Movie</h1>
      <p class="empty-state-description">{{`You\'ve got ${nominationsRemaining} nomination${nominationsRemaining > 1 ? 's' : ''} left. Use ${nominationsRemaining > 1 ? 'them' : 'it'} wisely!`}}</p>
      <v-btn color="primary" @click="$router.push('/discover')">Nominate a movie</v-btn>
    </div>

    <!-- voting empty state -->
    <div v-if="!isCurrentPollInNomination && currentPollOptions.length === 0" class="empty-state-container">
      <v-icon size="100px" class="mb-2">alert_circle</v-icon>
      <h1 class="display-1 mb-1">Oops</h1>
      <p class="empty-state-description">Looks like no movies were nominated. That's awkward.</p>
    </div>

    <div class="d-flex flex-column" v-if="getOptionsForCurrentPoll && currentPollOptions && currentPollOptions.length > 0" >
      <option-preview v-for="option in currentPollOptions" :key="option._id" :option="option" class="mb-3"></option-preview>
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
  data () {
    return {
      loaded: false
    }
  },
  computed: {
    ...mapGetters('option', ['getOptionsForCurrentPoll', 'nominationsRemaining']),
    ...mapGetters('poll', ['getActivePoll', 'isCurrentPollInNomination']),
    currentPollOptions: function () {
      return this.getOptionsForCurrentPoll.reverse()
    }
  },
  created () {
    queries.getOptionsForPoll(this.getActivePoll._id)
      .then(() => queries.getVotesForCurrentPoll())
      .then(() => { this.loaded = true })
      .catch(error => console.error(error))
  }
}
</script>