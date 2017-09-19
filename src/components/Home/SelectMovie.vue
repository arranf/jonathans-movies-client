<template>
  <swiper :options="swiperOption" :not-next-tick="notNextTick" class="swiper-box"  ref="voteSwiper">
        <template v-for="movie in movies" >
                <swiper-slide @click="vote()" :key="movie._id" class="swiper-item" :style="{backgroundColor: randomColor()}" >{{movie.name}}</swiper-slide>
        </template>
  </swiper>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import {mapActions, mapState, mapGetters} from 'vuex'
require('swiper/dist/css/swiper.css')

export default {
  name: 'SelectMovie',
  props: ['movies', 'pollId'],
  data() {
      return {
        gotSwipe: false,
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
            colors: ['#6a1b9a', '#4527a0', '#c62828', '#283593', '#1565c0', '#0277bd', '#00838f', '#00695c', '#2e7d32', '#ff8f00', '#d84315']
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
      randomColor: function (){
          return this.colors[Math.floor(Math.random() * this.colors.length)]
      },
      vote: function(){
          const index = this.$refs.voteSwiper.swiper.clickedIndex
          if (index == null){
              console.error('COULD NOT GET INDEX')
          }
          const movieOption = this.movies[index]
          const movieOptionId = movieOption._id
          const userId = this.user._id
          console.log('Chosen Movie is ' + movieOption)
          if (this.votes.some( v => v.user_id === userId && v.option_id === movieOptionId )){
              this.removeVote().then(console.log('Vote added for ', movieOption.name))
              .catch(error => console.error(error))
          } else {
              this.addVote({poll_id: this.pollId, option_id: movieOptionId, user_id: userId})
              .then(console.log('Vote added for ', movieOption.name))
              .catch(error => console.error(error))
          }
      }
  },
  computed: {
      ...mapGetters('vote', {findVote: 'find'}), ...mapGetters('vote', {votes: 'list'}),
      ...mapState('auth', ['user'])
  },
  mounted: function (){
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
  </style>