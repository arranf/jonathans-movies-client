<script>
export default {
  name: 'Actions',
  functional: true,
  render (h, { data, children }) {
    data.staticClass = (`vl-card__actions ${data.staticClass || ''}`).trim()
    return h('div', data, children)
  }

}
</script>
