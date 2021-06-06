<template>
  <div
    v-if="film && film.backdrop_path"
    class="v-responsive v-image flex-column"
  >
    <img
      class="image-fluid lazyload movie-bg"
      :data-srcset="srcSet"
      :srcset="srcSet"
      :style="style"
      :src="src"
      :alt="altText"
    />
    <div class="v-responsive__content"></div>
  </div>
</template>

<script>
// eslint-disable-next-line
import lazySizes from 'lazysizes'
import "lazysizes/plugins/native-loading/ls.native-loading";

import { getTmdbBackdropImage, getTmdbBackdropSrcSet } from "@/utils";

export default {
  name: "MovieBG",
  props: {
    height: {
      type: Number,
      default: 200,
    },
    film: {
      type: Object,
      required: true,
    },
  },
  computed: {
    // TODO: Test if style works best on parent container on both home screen and movie modal
    style: function () {
      if (!this.film.backdrop_svg_base64encoded) {
        return {};
      }
      return {
        "background-size": "cover",
        "background-image": this.backgroundImage,
      };
    },
    altText: function () {
      return `${this.film.name} Background`;
    },
    backgroundImage: function () {
      return `url(data:image/svg+xml;base64,${this.film.backdrop_svg_base64encoded})`;
    },
    src: function () {
      return getTmdbBackdropImage(this.film.backdrop_path);
    },
    srcSet: function () {
      return getTmdbBackdropSrcSet(this.film.backdrop_path);
    },
  },
};
</script>

<style scoped>
@media only screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation: landscape) {
  .movie-bg {
    width: auto;
    max-height: 23em;
    display: flex;
    align-self: center;
    border-radius: 2em;
  }
}

@media only screen and (min-device-width: 1024px) {
  .movie-bg {
    width: auto;
    max-height: 26em;
    display: flex;
    align-self: center;
    border-radius: 2em;
  }
}
</style>
