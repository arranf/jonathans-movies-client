<template>
  <div>
     <v-progress-circular  v-if="!isLoaded" indeterminate color="primary" />
     <!-- TODO Empty State -->

     <div class="d-flex flex-column" v-if="getOptionsForCurrentPoll && getOptionsForCurrentPoll.length > 0" >
      <h2 class="md-display-1 text-center">Vote</h2>
      <div class="scroll align-self-center">
        <template v-for="option in getOptionsForCurrentPoll"  >
          <div :key="option._id" class="scroll-item d-flex align-items-center flex-column">
            <option-preview :option="option"  />
            <v-checkbox :input-value="isVoted(option._id)" :disabled="!isVoted(option._id) && remainingVotes <= 0" @change="vote(option._id)" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState, mapGetters} from 'vuex'
import queries from '@/api'
import OptionPreview from '@/components/Home/Nominated/OptionPreview'

// require('swiper/dist/css/swiper.css')

export default {
  name: 'VoteForOption',
  data () {
    return {
      isLoaded: false
    }
  },
  components: {
    OptionPreview
  },
  methods: {
    ...mapActions('vote', {addVote: 'create'}),
    ...mapActions('vote', {removeVote: 'remove'}),
    vote: function (optionId) {
      let option = this.getOption(optionId)
      if (option == null) {
        console.error(`Couldn't get option for id ${optionId}`)
        this.$emit('snackbar', 'Error submitting vote.')
        return
      }
      if (this.isVoted(optionId)) {
        const vote = this.votes.find(v => v.user_id === this.user._id && v.option_id === optionId)
        this.removeVote(vote._id)
          .then(console.log('Vote removed from ', option.name))
          .catch(error => console.error(error))
      } else {
        if (this.remainingVotes <= 0) {
          this.$emit('snackbar', 'Unable to vote. You don\'t have any votes left')
          return
        }
        this.addVote({poll_id: this.getActivePoll._id, option_id: optionId})
          .then(console.log('Vote added for ', option.name))
          .then(this.$emit('snackbar', `Voted for ${option.name}. You have ${this.remainingVotes - 1} vote${this.remainingVotes > 1 ? 's' : ''} remaining`))
          .catch(error => { console.error(error); this.$emit('snackbar', 'Error submitting vote.') })
      }
    },
    isVoted: function (optionId) {
      return this.votes.some(v => v.user_id === this.user._id && v.option_id === optionId)
    }
  },
  computed: {
    ...mapGetters('vote', {votes: 'list'}),
    ...mapState('auth', ['user']),
    ...mapGetters('vote', {remainingVotes: 'votesRemaining'}),
    ...mapGetters('option', {getOption: 'get', getOptionsForCurrentPoll: 'getOptionsForCurrentPoll'}),
    ...mapGetters('poll', ['getActivePoll'])
  },
  mounted: function () {
    queries.getVotesForCurrentPoll()
      .then(() => { this.isLoaded = true })
      .catch(error => console.error(error))
  }
}
</script>

<style scoped>
  .input-group {
    width: unset !important;
  }

  .swiper-item {
    /* height: 100%; */
    /* text-align: center; */

    /* You can click this */
    cursor: pointer; 
    cursor: hand; 

    /* Center slide text vertically */
    /* display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column; */
  }
</style>