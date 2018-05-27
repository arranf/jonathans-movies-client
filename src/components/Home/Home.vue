<template>
  <div id="home-container" >
      <movie-info-modal :show.sync="showingFilm" close-route="/home" :filmId="filmId" :show-nominate="false" />
      <div>
        <selected-options v-if="getActivePoll" />
        <results v-else></results> 
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Results from '@/components/Results/Results'
import SelectedOptions from './Nominated/SelectedOptions'
import MovieInfoModal from '@/components/common/MovieInfoModal'

export default {
  name: 'Home',
  components: {
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
    ...mapGetters('poll', ['getActivePoll'])
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