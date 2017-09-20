<template>
  <swiper :options="swiperOption" :not-next-tick="notNextTick" class="swiper-box"  ref="voteSwiper">
        <template v-for="movie in movies" >
                <swiper-slide @click="vote()" :key="movie._id" class="swiper-item" :class="{voted: isVoted(movie._id)}" :style="{backgroundColor: getColor(movie._id)}" >
                    <div class="container">
                        <div class="row">
                            <div class="col">
                                {{movie.name}}
                            </div>
                        </div>
                        <div v-if="isVoted(movie._id)" class="row">
                            <div class="col">
                                <i class="fa fa-check fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </swiper-slide>
        </template>
  </swiper>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import {mapActions, mapState, mapGetters} from 'vuex'
import utils from '@/utils'
import constants from '@/constants'

require('swiper/dist/css/swiper.css')

export default {
  name: 'SelectMovie',
  props: ['movies', 'pollId'],
  data() {
      return {
        movieColors: {
            currentIndex: 0,
            colors: constants.colors['800'],
            movieColorMap: {}
        },
        notNextTick: true,
        swiperOption: {
          onClick: this.vote,
          setWrapperSize :true,
                slidesPerView: 3,
                spaceBetween: 40,
                mousewheelControl : true,
                observeParents:true,
                preventClicks: false,
                loop: false // This as true breaks things
                // TODO RESPONSIVE BREAKPOINTS
                // https://github.com/surmon-china/vue-awesome-swiper/blob/master/examples/33-responsive-breakpoints.vue
            },
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
      getColor: function (movieId){
          let movieColors = this.movieColors
          if (movieId in movieColors.movieColorMap){
              return movieColors.movieColorMap[movieId]
          } 
          let currentIndex = movieColors.currentIndex
          this.movieColors.movieColorMap[movieId] = movieColors.colors[currentIndex]
          if (currentIndex+1 === movieColors.colors.length){
              movieColors.currentIndex = 0
          } else {
              movieColors.currentIndex++
          }
          return movieColors.movieColorMap[movieId]
      },
      vote: function(){
          
          const index = this.$refs.voteSwiper.swiper.clickedIndex
          if (index == null){
              console.error('Could not get movie index')
              return
          }
          const movieOption = this.movies[index]
          const movieOptionId = movieOption._id
          if (this.isVoted(movieOptionId)) {
              const vote = this.votes.find(v => v.user_id === this.user._id && v.option_id === movieOptionId)
              this.removeVote(vote._id).then(console.log('Vote removed from ', movieOption.name))
              .catch(error => console.error(error))
          } else {
            if (this.remainingVotes <= 0){
              // TODO Show user error
              return
            }
              this.addVote({poll_id: this.pollId, option_id: movieOptionId, user_id: this.user._id})
              .then(console.log('Vote added for ', movieOption.name))
              .catch(error => console.error(error))
          }
      },
      isVoted: function(movieId){
          return this.votes.some( v => v.user_id === this.user._id && v.option_id === movieId )
      }
  },
  computed: {
      ...mapGetters('vote', {findVote: 'find'}), ...mapGetters('vote', {votes: 'list'}),
      ...mapState('auth', ['user']),
      ...mapGetters('vote', {remainingVotes: 'votesRemaining'}),
  },
  mounted: function (){
      utils.shuffle(this.movieColors.colors)
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