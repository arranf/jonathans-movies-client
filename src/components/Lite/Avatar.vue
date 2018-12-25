<script>
export default {
  functional: true,
  name: 'Avatar',
  color: String,

  size: {
    type: [Number, String],
    default: 48
  },
  render (h, { data, props, children }) {
    data.staticClass = (`vl-avatar ${data.staticClass || ''}`).trim()

    const size = props.size.toString().endsWith('px') ? props.size : props.size + 'px'
    data.style = {
      height: size,
      width: size,
      ...data.style
    }
    data.class = {
      ...data.class,
      [props.color]: true
    }

    return h('div', data, children)
  }
}
</script>

<style lang="stylus">
.vl-avatar
  align-items: center
  border-radius: 50%
  display: inline-flex
  justify-content: center
  position: relative
  text-align: center
  vertical-align: middle

  img,
  .vl-icon,
  .vl-image
    border-radius: 50%
    display: inline-flex
    height: inherit
    width: inherit

    img,
    .vl-icon,
    .vl-image
      border-radius: 0
</style>
