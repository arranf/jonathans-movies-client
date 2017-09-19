<template>
  <swiper :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper">
        <swiper-slide v-for="option in options" @click="vote(option._id)">
            {{option.Name}}
        </swiper-slide>
  </swiper>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
require('swiper/dist/css/swiper.css')

export default {
  name: 'SelectMovie',
  props: ['options'],
  data() {
      return {
            swiperOption: {
                pagination: '.swiper-pagination',
                slidesPerView: 3,
                paginationClickable: true,
                spaceBetween: 30,
                mousewheelControl : true
            }
      }
  }
}
</script>
