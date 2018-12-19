<template>
  <card>
    <!-- TODO: Replace with MovieBG (?) -->
    <div v-if="option && film && film.backdrop_path" class="card__media">
        <img class="img-fluid lazyload" :src="film.backDropSvgPlaceholder" :data-srcset="film.tmdbBackdropSrcSet" :alt="option.name + ' image'">
        <div class="card__media__content"></div>
    </div>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{option.name}}</h3>
        <div v-if="film">{{film.tagline}}</div>
      </div>
    </v-card-title>
    <v-card-actions>
      <v-btn :color="voteButtonColor" @click="vote" v-if="!isCurrentPollInNomination && getActivePoll" :disabled="!isVoted(option._id) && remainingVotes <= 0" flat>
        {{voteButtonText}}
      </v-btn>
      <v-btn @click="showModal()" flat color="orange">More Info</v-btn>
    </v-card-actions>
  </card>
</template>

<script>
import { colors } from '@/constants'
import { selectRandom } from '@/utils'
import { mapActions, mapGetters, mapState } from 'vuex'
import Card from '@/components/Lite/Card'

export default {
  name: 'OptionPreview',
  props: {
    option: { type: Object, required: true },
    showInfo: { type: Boolean, default: true }
  },
  components: {
    Card
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('vote', { remainingVotes: 'votesRemaining', votes: 'list' }),
    ...mapGetters('poll', ['getActivePoll', 'isCurrentPollInNomination']),
    voteButtonText: function () {
      if (this.isVoted) {
        return 'Remove Vote'
      }
      return 'Vote'
    },
    voteButtonColor: function () {
      if (this.isVoted) {
        return 'error'
      }
      return 'primary'
    },
    film () {
      return this.option.film
    },
    isVoted: function () {
      return this.votes.some(
        v => v && v.user_id === this.user._id && v.option_id === this.option._id
      )
    }
  },
  methods: {
    ...mapActions('films', { fetchFilm: 'get' }),
    ...mapActions('vote', { addVote: 'create', removeVote: 'remove' }),
    ...mapActions('snackbar', { setSnackbar: 'setText' }),
    vote: function () {
      if (this.option == null) {
        this.setSnackbar('Error submitting vote.')
        return
      }
      let optionId = this.option._id
      if (this.isVoted(optionId)) {
        const vote = this.votes.find(
          v => v.user_id === this.user._id && v.option_id === optionId
        )
        this.removeVote(vote._id)
          .catch(error => console.error(error))
      } else {
        if (this.remainingVotes <= 0) {
          this.setSnackbar("Unable to vote. You don't have any votes left")
          return
        }
        this.addVote({ poll_id: this.getActivePoll._id, option_id: optionId })
          .then(
            this.setSnackbar(
              `Voted! You have ${this.remainingVotes - 1} vote${
                this.remainingVotes === 1 ? '' : 's'
              } remaining`
            )
          )
          .catch(error => {
            console.error(error)
            this.setSnackbar('Error submitting vote.')
          })
      }
    },
    getColor: function () {
      return selectRandom(colors['800'])
    },
    showModal: function () {
      if (this.film && this.showInfo) {
        this.$router.push({ name: 'Home', params: { filmId: this.film._id } })
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
