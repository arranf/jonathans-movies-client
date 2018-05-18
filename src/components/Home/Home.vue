<template>
  <div id="home-container" >
      <movie-info-modal :show.sync="showingFilm" close-route="/home" :filmId="filmId" :show-nominate="false" />
      <div>
        <selected-options v-if="isCurrentPollInNomination" />
        <vote-for-option @snackbar="setSnackbar" v-else-if="getActivePoll"></vote-for-option>
        <results v-else></results> 
      </div> 
      <v-snackbar id="snackbar" :bottom="true" v-model="showSnackbar">
        <span>{{snackbarText}}</span>
      </v-snackbar>
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
      showSnackbar: false,
      snackbarText: '',
      showingFilm: false
    }
  },
  props: {
    filmId: String
  },
  computed: {
    ...mapGetters('poll', ['getActivePoll', 'isCurrentPollInNomination'])
  },
  methods: {
    setSnackbar (snackbarText) {
      this.showSnackbar = true
      this.snackbarText = snackbarText
    }
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