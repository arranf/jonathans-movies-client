<template>
  <swiper :options="swiperOption" class="swiper-box">
        <template v-for="movie in movies" >
            <swiper-slide class="swiper-item" :style="{backgroundColor: randomColor()}" :key="movie._id" @click="vote(movie._id)">{{movie.name}}</swiper-slide>
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
            swiperOption: {
                slidesPerView: 3,
                spaceBetween: 40,
                mousewheelControl : true,
                observeParents:true,
            },
            colors: ['#6a1b9a', '#4527a0', '#c62828', '#283593', '#1565c0', '#0277bd', '#00838f', '#00695c', '#2e7d32', '#ff8f00', '#d84315']
      }
  },
  components: {
    swiper,
    swiperSlide
  },
  methods: {
      ...mapActions('vote', [{voteAdd: 'create'}, {voteRemove: 'remove'}]),
      randomColor: function (){
          return this.colors[Math.floor(Math.random() * this.colors.length)]
      },
      vote: function(movieId){
          if (votes.contains(movieId)){
              // remove
          } else {
              // add
          }
      }
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
    color: white;
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