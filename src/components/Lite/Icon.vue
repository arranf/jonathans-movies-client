<script>
export default {
  functional: true,
  render (h, { props, children }) {
    const iconName = children ? children[0].text : ''
    const style = props.size ? { 'font-size': props.size } : {}
    const data = { staticClass: 'vl-icon material-icons', attr: { 'aria-hidden': true }, style }
    return h('i', data, [iconName])
  }
}
</script>

<style lang="stylus" scoped>
@require '../../assets/styles/vuetify-lite/settings/_variables/_transition.styl'

.vl-icon
  align-items: center
  display: inline-flex
  font-feature-settings: 'liga'
  font-size: 24px
  justify-content: center
  line-height: 1
  transition: $primary-transition
  vertical-align: text-bottom
  color: rgba(0,0,0,0.54)
</style>
