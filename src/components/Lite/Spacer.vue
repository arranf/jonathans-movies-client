<script>
// TODO Stop this being a component, just use <div class="spacer"></div>
export default {
  functional: true,
  render (h) {
    return h('div', { staticClass: 'spacer' })
  }
}
</script>

<style lang="stylus" scoped>
.spacer
  flex-grow: 1 !important
</style>
