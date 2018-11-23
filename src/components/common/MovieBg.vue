<template>
  <div v-if="film && film.backdrop_path" class="v-responsive v-image">
    <img class="image-fluid lazyload" :srcset="srcSet" :src="src" :alt="altText" :style="style">
    <div class="v-responsive__content"></div>
  </div>
</template>

<script>
// eslint-disable-next-line
import lazySizes from 'lazysizes'
import utils from '@/utils'

export default {
  name: 'MovieBG',
  props: {
    height: {
      type: Number,
      default: 200
    },
    film: {
      type: Object,
      required: true
    }
  },
  computed: {
    style: function () {
      if (!this.film.backdrop_svg_base64encoded) {
        return {}
      }
      return {
        'background-size': 'cover',
        'background-image': this.backgroundImage
      }
    },
    altText: function () {
      return `${this.film.name} Background`
    },
    backgroundImage: function () {
      return `url(data:image/svg+xml;base64,${
        this.film.backdrop_svg_base64encoded
      })`
    },
    src: function () {
      return utils.getTmdbBackdropImage(this.film.backdrop_path)
    },
    srcSet: function () {
      return utils.getTmdbBackdropSrcSet(this.film.backdrop_path)
    }
  }
}
</script>
