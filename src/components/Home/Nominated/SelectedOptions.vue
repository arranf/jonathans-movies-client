<template>
  <div>
    <!-- nominations empty state -->
    <div
      v-if="isCurrentPollInNomination && currentPollOptions.length === 0"
      class="empty-state-container"
    >
      <v-icon size="100px" class="mb-2">playlist_add</v-icon>
      <h1 class="display-1 mb-1">Nominate a Movie</h1>
      <p class="empty-state-description">{{nominationsRemainingText}}</p>
      <p>{{remainingTimeInNominationWordsForCurrentPoll}}</p>
      <v-btn color="primary" @click="$router.push('/discover')">Nominate a movie</v-btn>
    </div>

    <!-- voting empty state -->
    <div
      v-if="!isCurrentPollInNomination && currentPollOptions.length === 0"
      class="empty-state-container"
    >
      <v-icon size="100px" class="mb-2">alert_circle</v-icon>
      <h1 class="display-1 mb-1">Oops</h1>
      <p class="empty-state-description">Looks like no movies were nominated. That's awkward.</p>
    </div>

    <div
      class="d-flex flex-column"
      v-if="getOptionsForCurrentPoll && currentPollOptions && currentPollOptions.length > 0"
    >
      <status-card class="mb-4" />
      <option-preview
        v-for="option in currentPollOptions"
        :key="option._id"
        :option="option"
        class="mb-3"
      ></option-preview>
    </div>
  </div>
</template>

<script>
import OptionPreview from './OptionPreview'
import StatusCard from '../StatusCard'
import { getOptionsForPoll, getVotesForCurrentPoll } from '@/api'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'SelectedOptions',
  components: {
    OptionPreview,
    StatusCard
  },
  methods: {
    ...mapActions('loading', ['setLoaded', 'setLoading'])
  },
  computed: {
    ...mapGetters('option', [
      'getOptionsForCurrentPoll',
      'nominationsRemaining'
    ]),
    ...mapGetters('poll', [
      'getActivePoll',
      'isCurrentPollInNomination',
      'remainingTimeInNominationWordsForCurrentPoll'
    ]),
    currentPollOptions: function () {
      // eslint-disable-next-line
      return this.getOptionsForCurrentPoll.reverse();
    },
    nominationsRemainingText: function () {
      return `You've got ${this.nominationsRemaining} nomination${
        this.nominationsRemaining > 1 ? 's' : ''
      } left. Use ${this.nominationsRemaining > 1 ? 'them' : 'it'} wisely!`
    }
  },
  async created () {
    try {
      await this.setLoading('Home') // This is required because the home route has two possible components
      await getOptionsForPoll(this.getActivePoll._id)
      await getVotesForCurrentPoll()
      await this.setLoaded('Home')
    } catch (e) {
      console.error(e)
    }
  }
}
</script>
