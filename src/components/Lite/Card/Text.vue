<script>
export default {
  name: 'CardText',

  functional: true,

  render (h, { data, children }) {
    data.staticClass = (`vl-card__text ${data.staticClass || ''}`).trim()

    return h('div', data, children)
  }
}
</script>
