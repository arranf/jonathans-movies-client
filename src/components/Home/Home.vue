<template>
  <div id="home-container" >
      <movie-info-modal :show.sync="showingFilm" close-route="/home" :filmId="filmId" :show-nominate="false" />
      <div>
        <selected-options v-if="isCurrentPollInNomination" />
        <vote-for-option v-else-if="getActivePoll"></vote-for-option>
        <results v-else></results> 
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VoteForOption from '@/components/Home/VoteForOption'
import Results from '@/components/Results/Results'
import SelectedOptions from './Nominated/SelectedOptions'
import MovieInfoModal from '@/components/common/MovieInfoModal'

export default {
  name: 'Home',
  components: {
    VoteForOption,
    Results,
    SelectedOptions,
    MovieInfoModal
  },
  data () {
    return {
      showingFilm: false
    }
  },
  props: {
    filmId: String
  },
  computed: {
    ...mapGetters('poll', ['getActivePoll', 'isCurrentPollInNomination'])
  },
  watch: {
    'filmId' (newFilmId, oldFilmId) {
      this.showingFilm = Boolean(newFilmId)
    }
  },
  created () {
    this.showingFilm = Boolean(this.filmId)
  }
}
</script>