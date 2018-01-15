<template>
  <div class="h-100">
    <md-progress-spinner v-if="!isLoaded" :md-diameter="100" :md-stroke="10" md-mode="indeterminate"></md-progress-spinner>
    <swiper v-else :options="swiperOption" :not-next-tick="notNextTick" class="swiper-box"  ref="voteSwiper">
          <template v-for="option in getOptionsForCurrentPoll" >
                  <swiper-slide :key="option._id" class="swiper-item" :class="{voted: isVoted(option._id)}" :style="{backgroundColor: getColor(option._id)}" >
                      <div>
                        <h3 class="text-white md-headline no-select">{{option.name}}</h3>
                      </div>
                      <div :class="{hidden: !isVoted(option._id)}" class="no-select">
                        <i class="fa fa-check fa-2x text-white"></i>
                      </div>
                  </swiper-slide>
          </template>
          <div class="swiper-pagination"  slot="pagination"></div>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import {mapActions, mapState, mapGetters} from 'vuex'
import utils from '@/utils'
import constants from '@/constants'
import queries from '@/api'

require('swiper/dist/css/swiper.css')

export default {
  name: 'VoteForOption',
  data () {
    return {
      optionColors: {
        currentIndex: 0,
        colors: constants.colors['800'],
        optionColorMap: {}
      },
      isLoaded: false,
      notNextTick: true,
      swiperOption: {
        simulateTouch: true,
        preventClicks: true,
        onClick: this.vote,
        setWrapperSize: true,
        initialSlide: 0,
        slidesPerView: 3,
        spaceBetween: 40,
        mousewheelControl: true,
        observeParents: true,
        loop: false,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        prevButton: '.swiper-button-prev',
        nextButton: '.swiper-button-next',
        // https://github.com/surmon-china/vue-awesome-swiper/blob/master/examples/33-responsive-breakpoints.vue
        breakpoints: {
          576: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 30
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 40
          }
        }
      }
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  methods: {
    ...mapActions('vote', {addVote: 'create'}),
    ...mapActions('vote', {removeVote: 'remove'}),
    getColor: function (optionId) {
      let optionColors = this.optionColors
      if (optionId in optionColors.optionColorMap) {
        return optionColors.optionColorMap[optionId]
      }

      let currentIndex = optionColors.currentIndex
      this.optionColors.optionColorMap[optionId] = optionColors.colors[currentIndex]
      if (currentIndex + 1 === optionColors.colors.length) {
        optionColors.currentIndex = 0
      } else {
        optionColors.currentIndex++
      }
      return optionColors.optionColorMap[optionId]
    },
    vote: function () {
      const index = this.$refs.voteSwiper.swiper.clickedIndex
      if (index == null) {
        console.error('Could not get option index')
        return
      }

      const option = this.getOptionsForCurrentPoll[index]
      const optionId = option._id
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
    ...mapGetters('option', ['getOptionsForCurrentPoll']),
    ...mapGetters('poll', ['getActivePoll'])
  },
  mounted: function () {
    utils.shuffle(this.optionColors.colors)
    queries.getVotesForCurrentPoll()
      .then(() => { this.isLoaded = true })
      .catch(error => console.error(error))
  }
}
</script>

<style scoped>
  .swiper-box {
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }
  .swiper-item {
    height: 100%;
    text-align: center;

    /* You can click this */
    cursor: pointer; 
    cursor: hand; 

    /* Center slide text vertically */
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
  }

  .hidden {
    visibility: hidden;
  }

  .voted {
      opacity: 0.8;
  }
</style>