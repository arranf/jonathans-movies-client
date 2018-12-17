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
