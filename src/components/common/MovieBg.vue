<script>

export default {
  functional: true,
  name: 'MovieBG',
  props: {
    film: {
      type: Object,
      required: true
    }
  },
  render (h, { props }) {
    const film = props.film
    console.log(`Rendering ${film.name}: start`)
    const style = function () {
      if (!film.backdropSvgPlaceholder) {
        return {}
      }
      return {
        'background-size': 'cover',
        'background-image': film.backdropSvgPlaceholder
      }
    }
    if (film && film.tmdbBackDropImage) {
      console.log(`Rendering ${film.name}: will return`)

      const altText = `${film.name} Background`
      const src = film.backdropSvgPlaceholder
      const srcSet = film.tmdbBackdropSrcSet
      const img = h('img', { staticClass: 'image-fluid movie-bg', attrs: { 'data-srcset': srcSet, src, alt: altText }, style })
      const innerDiv = h('div', { staticClass: 'responsive__content' })
      const div = h('div', { staticClass: 'v-responsive v-image flex-column' }, [img, innerDiv])
      return div
    }
    return h('div')
  }
}
</script>

<style scoped>
  .lazyload {
    width: 100% !important;
    min-width: 100% !important;
  }

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
