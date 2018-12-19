<script>
export default {
  name: 'CardTitle',
  functional: true,
  props: {
    primaryTitle: Boolean
  },
  render (h, { data, props, children }) {
    data.staticClass = (`vl-card__title ${data.staticClass || ''}`).trim()

    if (props.primaryTitle) data.staticClass += ' vl-card__title--primary'

    return h('div', data, children)
  }
}
</script>
