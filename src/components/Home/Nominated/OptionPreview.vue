<template>
  <v-card>
    <v-card-media v-if="film" :src="getFilmBackdrop" height="200px" >
    </v-card-media>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{option.name}}</h3>
        <div v-if="film">{{film.tagline}}</div>
      </div>
    </v-card-title>
    <v-card-actions>
      <v-btn @click="vote" v-if="!isCurrentPollInNomination && getActivePoll" :disabled="!isVoted(option._id) && remainingVotes <= 0" flat color="orange">
        {{voteButtonText}}
      </v-btn>
      <v-btn @click="showModal()" flat color="orange">More Info</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import constants from '@/constants'
import utils from '@/utils'
import {mapActions, mapGetters, mapState} from 'vuex'

export default {
  name: 'OptionPreview',
  props: {
    option: {type: Object, required: true},
    showInfo: {type: Boolean, default: true}
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('films', {getFilm: 'get'}),
    ...mapGetters('vote', {remainingVotes: 'votesRemaining', votes: 'list'}),
    ...mapGetters('option', {getOption: 'get', getOptionsForCurrentPoll: 'getOptionsForCurrentPoll'}),
    ...mapGetters('poll', ['getActivePoll', 'isCurrentPollInNomination']),
    voteButtonText: function () {
      if (this.isVoted(this.option._id)) {
        return 'Remove Vote'
      }
      return 'Vote'
    },
    lastWatched: function () {
      if (this.film && this.film.lastWatched) {
        return utils.humanizeTimeToNowImprecise(this.film.lastWatched) + ' ago'
      }
      return null
    },
    getFilmPoster: function () {
      if (this.film && this.film.poster_path) {
        return utils.getTmdbPosterImage(this.film.poster_path)
      }
      return ''
    },
    getFilmBackdrop: function () {
      if (this.film && this.film.backdrop_path) {
        return utils.getTmdbBackdropImage(this.film.backdrop_path)
      }
      return ''
    },
    film () {
      if (this.option.film_id) {
        return this.getFilm(this.option.film_id)
      }
      return null
    }
  },
  methods: {
    ...mapActions('films', {fetchFilm: 'get'}),
    ...mapActions('vote', {addVote: 'create', removeVote: 'remove'}),
    ...mapActions('snackbar', {setSnackbar: 'setText'}),
    vote: function () {
      if (this.option == null) {
        this.setSnackbar('Error submitting vote.')
        return
      }
      let optionId = this.option._id
      if (this.isVoted(optionId)) {
        const vote = this.votes.find(v => v.user_id === this.user._id && v.option_id === optionId)
        this.removeVote(vote._id)
          .then(console.log('Vote removed from ', this.option.name))
          .catch(error => console.error(error))
      } else {
        if (this.remainingVotes <= 0) {
          this.setSnackbar('Unable to vote. You don\'t have any votes left')
          return
        }
        this.addVote({poll_id: this.getActivePoll._id, option_id: optionId})
          .then(console.log('Vote added for ', this.option.name))
          .then(this.setSnackbar(`Voted for ${this.option.name}. You have ${this.remainingVotes - 1} vote${this.remainingVotes > 1 ? 's' : ''} remaining`))
          .catch(error => { console.error(error); this.setSnackbar('Error submitting vote.') })
      }
    },
    isVoted: function () {
      return this.votes.some(v => v && v.user_id === this.user._id && v.option_id === this.option._id)
    },
    getColor: function () {
      return utils.selectRandom(constants.colors['800'])
    },
    showModal: function () {
      if (this.film && this.showInfo) {
        this.$router.push({name: 'Home', params: { filmId: this.film._id }})
      }
    }
  },
  created () {
    if (!this.film) {
      this.fetchFilm(this.option.film_id)
    }
  }
}
</script>