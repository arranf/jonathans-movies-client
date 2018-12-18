// TODO: Make this use TypeScript
<script>
import {
  VFadeTransition,
  VSlideXTransition
} from 'vuetify/lib/components/transitions'

export default {
  functional: true,
  name: 'ProgressLinear',
  props: {
    progress: { required: false, type: Number, default: 0 },
    indeterminate: { required: false, type: Boolean },
    height: { required: false, type: [Number, String], default: 7 },
    color: { required: false, type: String, default: 'primary' }
  },
  render (h, context) {
    const props = context.props
    function genDeterminate (h, progress, color) {
      return h('div', {
        ref: 'front',
        staticClass: `v-progress-linear__bar__determinate`,
        style: {
          width: `${progress}%`
        },
        class: color
      })
    }

    function genBar (h, name, color) {
      return h('div', {
        staticClass: 'v-progress-linear__bar__indeterminate',
        class: [color, name]
      })
    }

    function genIndeterminate (h, color) {
      return h('div', {
        ref: 'front',
        staticClass: 'v-progress-linear__bar__indeterminate',
        class: 'v-progress-linear__bar__indeterminate--active'
      }, [
        genBar(h, 'long', color),
        genBar(h, 'short', color)
      ])
    }

    const fade = h(VFadeTransition, props.indeterminate ? [genIndeterminate(h, props.color)] : [])
    const slide = h(VSlideXTransition, props.indeterminate ? [] : [genDeterminate(h, props.progress, props.color)])

    const styles = {}
    const backgroundStyle = {
      height: `${props.height}px`,
      opacity: 0.3,
      width: '100%'
    }

    const bar = h('div', {
      staticClass: 'v-progress-linear__bar',
      style: styles
    }, [fade, slide])

    const background = h('div', {
      staticClass: 'v-progress-linear__background',
      class: props.color,
      style: backgroundStyle
    })

    return h('div', {
      staticClass: `v-progress-linear ${context.data.staticClass}`, // This passes any classes put on the component to this div
      attrs: {
        'role': 'progressbar',
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': props.indeterminate ? undefined : props.progress
      },
      style: {
        height: `${props.height}px`
      }
    }, [
      background,
      bar
    ])
  }
}
</script>

<style lang="stylus" scoped>
@require '../../assets/styles/vuetify-lite/settings/_variables/_transition.styl'

.v-progress-linear
  background: transparent
  margin: 1rem 0
  overflow: hidden
  width: 100%
  position: relative

  &__bar
    width: 100%
    height: inherit
    position: relative
    transition: .2s $transition.ease-in-out
    z-index: 1

    &__determinate
      height: inherit
      transition: .2s $transition.ease-in-out

    &__indeterminate
      .long, .short
        height: inherit
        position: absolute
        left: 0
        top: 0
        bottom: 0
        will-change: left, right
        width: auto
        background-color: inherit

      &--active .long
        animation: indeterminate
        animation-duration: 2.2s
        animation-iteration-count: infinite

      &--active .short
        animation: indeterminate-short
        animation-duration: 2.2s
        animation-iteration-count: infinite

  &__background
    position: absolute
    top: 0
    left: 0
    bottom: 0
    transition: .3s ease-in

  @keyframes indeterminate
    0%
      left: -90%
      right: 100%
    60%
      left: -90%
      right: 100%
    100%
      left: 100%
      right: -35%

  @keyframes indeterminate-short
    0%
      left: -200%
      right: 100%
    60%
      left: 107%
      right: -8%
    100%
      left: 107%
      right: -8%

  @keyframes query
    0%
      right: -90%
      left: 100%
    60%
      right: -90%
      left: 100%
    100%
      right: 100%
      left: -35%

  @keyframes query-short
    0%
      right: -200%
      left: 100%
    60%
      right: 107%
      left: -8%
    100%
      right: 107%
      left: -8%
</style>
