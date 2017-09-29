<template>
  <swiper :options="swiperOption" :not-next-tick="notNextTick" class="swiper-box"  ref="voteSwiper">
        <template v-for="option in getOptionsForCurrentPoll" >
                <swiper-slide @click="vote()" :key="option._id" class="swiper-item" :class="{voted: isVoted(option._id)}" :style="{backgroundColor: getColor(option._id)}" >
                    <div class="container">
                        <div class="row">
                            <div class="col">
                                {{option.name}}
                            </div>
                        </div>
                        <div v-if="isVoted(option._id)" class="row">
                            <div class="col">
                                <i class="fa fa-check fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </swiper-slide>
        </template>
        <div class="swiper-pagination"  slot="pagination"></div>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
  </swiper>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import {mapActions, mapState, mapGetters} from 'vuex'
import utils from '@/utils'
import constants from '@/constants'

require('swiper/dist/css/swiper.css')

export default {
  name: 'VoteForOption',
  data() {
      return {
        optionColors: {
            currentIndex: 0,
            colors: constants.colors['800'],
            optionColorMap: {}
        },
        notNextTick: true,
        swiperOption: {
                onClick: this.vote,
                setWrapperSize: true,
                initialSlide: 0,
                slidesPerView: 3,
                spaceBetween: 40,
                mousewheelControl : true,
                observeParents:true,
                preventClicks: false,
                loop: false,
                pagination : '.swiper-pagination',
                paginationClickable :true,
                prevButton:'.swiper-button-prev',
                nextButton:'.swiper-button-next',
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
                } // This as true breaks things
              },
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
      ...mapActions('vote', {getVotes: 'find'}),
      getColor: function (optionId){
          let optionColors = this.optionColors
          if (optionId in optionColors.optionColorMap){
              return optionColors.optionColorMap[optionId]
          } 
          let currentIndex = optionColors.currentIndex
          this.optionColors.optionColorMap[optionId] = optionColors.colors[currentIndex]
          if (currentIndex+1 === optionColors.colors.length){
              optionColors.currentIndex = 0
          } else {
              optionColors.currentIndex++
          }
          return optionColors.optionColorMap[optionId]
      },
      vote: function(){
          const index = this.$refs.voteSwiper.swiper.clickedIndex
          if (index == null){
              console.error('Could not get option index')
              return
          }
          const option = this.getOptionsForCurrentPoll[index]
          console.log(option)
          const optionId = option._id
          if (this.isVoted(optionId)) {
              const vote = this.votes.find(v => v.user_id === this.user._id && v.option_id === optionId)
              this.removeVote(vote._id)
              .then(console.log('Vote removed from ', option.name))
              .catch(error => console.error(error))
          } else {
            if (this.remainingVotes <= 0){
              // TODO Show user error
              return
            }
              this.addVote({poll_id: this.getActivePoll._id, option_id: optionId, user_id: this.user._id})
              .then(console.log('Vote added for ', option.name))
              .catch(error => console.error(error))
          }
      },
      isVoted: function(optionId){
          return this.votes.some( v => v.user_id === this.user._id && v.option_id === optionId )
      }
  },
  computed: {
      ...mapGetters('vote', {findVote: 'find'}), ...mapGetters('vote', {votes: 'list'}),
      ...mapState('auth', ['user']),
      ...mapGetters('vote', {remainingVotes: 'votesRemaining'}),
      ...mapGetters('option', ['getOptionsForCurrentPoll']),
      ...mapGetters('poll', ['getActivePoll'])
  },
  mounted: function (){
      utils.shuffle(this.optionColors.colors)
      console.log('Current swiper instance object',  this.$refs.voteSwiper.swiper)
      
      this.getVotes({query:{}}).catch(error => console.error(error))
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
    font-size: 1.8em ;
    color: #ffffff;
    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    cursor: pointer; 
    cursor: hand; 
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }

    .voted {
        opacity: 0.8;
    }
  </style>