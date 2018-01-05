<template>
<div class="d-flex h-100 justify-content-center">
  <movie-info-modal :show.sync="showingFilm" :filmId="$route.params.filmId" :show-nominate="false" />
  <md-empty-state
      v-if="currentPollOptions.length === 0"
      md-icon="playlist_add"
      md-label="Nominate a movie"
      :md-description="`You\'ve got, ${nominationsRemaining} nominations left. Use them wisely!`">
      <md-button class="md-primary md-raised" @click="$router.push('/movies')">Nominate a movie</md-button>
  </md-empty-state>

  <div v-if="getOptionsForCurrentPoll && currentPollOptions && currentPollOptions.length > 0" class="d-flex flex-column align-items-center justify-content-center">

    <h2 class="md-display-1 text-center">Nominations</h2>
    <div class="d-flex scroll flex-row">
      <template v-for="option in currentPollOptions">
        <option-preview class="scroll-item" :key="option._id" :option="option"></option-preview>
      </template>
    </div>
  </div>
</div>
</template>

<script>
import OptionPreview from './OptionPreview'
import MovieInfoModal from '@/components/common/MovieInfoModal'
import queries from '@/api'
import {mapGetters} from 'vuex'

export default {
  name: 'SelectedOptions',
  data () {
    return {
      showingFilm: false
    }
  },
  components: {
    OptionPreview,
    MovieInfoModal
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
  },
  watch: {
    '$route' (to, from) {
      this.showingFilm = Boolean(to.params.filmId)
    }
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
