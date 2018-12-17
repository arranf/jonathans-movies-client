<script>
// eslint-disable-next-line
import lazySizes from 'lazysizes'
import { getTmdbBackdropImage, getTmdbBackdropSrcSet } from '@/utils'

export default {
  functional: true,
  name: 'MovieBG',
  props: {
    film: {
      type: Object,
      required: true
    }
  },
  render (h, context) {
    const style = function () {
      if (!context.props.film.backdrop_svg_base64encoded) {
        return {}
      }
      return {
        'background-size': 'cover',
        'background-image': this.backgroundImage
      }
    }

    if (context.props.film && context.props.film.backdrop_path) {
      const altText = `${context.props.film.name} Background`
      const src = getTmdbBackdropImage(context.props.film.backdrop_path)
      const srcSet = getTmdbBackdropSrcSet(context.props.film.backdrop_path)
      const img = h('img', { staticClass: 'image-fluid lazyload movie-bg', attrs: { 'data-srcset': srcSet, srcSet: srcSet, src, alt: altText }, style })
      const innerDiv = h('div', { staticClass: 'responsive__content' })
      const div = h('div', { staticClass: 'v-responsive v-image flex-column' }, [img, innerDiv])
      return div
    }
  }
}
</script>

<style scoped>
  @media only screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:landscape) {
    .movie-bg {
      width: auto;
      max-height: 23em;
      display: flex;
      align-self: center;
      border-radius: 2em;
    }
  }

  @media only screen and (min-device-width: 1024px)  {
    .movie-bg {
      width: auto;
      max-height: 26em;
      display: flex;
      align-self: center;
      border-radius: 2em;
    }
  }
</style>
