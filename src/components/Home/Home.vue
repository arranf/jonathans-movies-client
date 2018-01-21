<template>
  <div id="home-container">
      <selected-options v-if="isCurrentPollInNomination" />
      <vote-for-option @snackbar="setSnackbar" v-else-if="getActivePoll"></vote-for-option>
      <results v-else></results>  
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

export default {
  name: 'Home',
  components: {
    VoteForOption,
    Results,
    SelectedOptions
  },
  data () {
    return {
      showSnackbar: false,
      snackbarText: ''
    }
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
  created: function () {
    // TODO Move to router
    // Sync client time with server time
  }
}
</script>