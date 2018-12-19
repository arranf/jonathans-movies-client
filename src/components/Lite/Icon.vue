<script>
export default {
  functional: true,
  props: {
    size: { type: String }
  },
  render (h, { props, children, data }) {
    const iconName = children ? children[0].text : ''
    const style = props.size ? { 'font-size': props.size } : {}
    const passedClass = data.staticClass ? data.staticClass : ''
    const iconData = { staticClass: `vl-icon material-icons theme--light ${passedClass}`, attr: { 'aria-hidden': true }, style }
    return h('i', iconData, [iconName])
  }
}
</script>

<style lang="stylus" scoped>
@require '../../assets/styles/vuetify-lite/theme.styl'
@require '../../assets/styles/vuetify-lite/settings/_variables/_transition.styl'

/* Themes */
v-icon($material)
  color: $material.icons.active

  &.v-icon--disabled
    color: $material.icons.inactive !important

theme(v-icon, "v-icon")

.v-item-group.v-bottom-nav .v-btn .v-btn__content i.vl-icon
    color: inherit;
    margin-bottom: 4px;
    -webkit-transition: all .4s cubic-bezier(.25,.8,.5,1);
    transition: all .4s cubic-bezier(.25,.8,.5,1);

.v-btn:not(.v-btn--disabled):not(.v-btn--floating):not(.v-btn--icon) .v-btn__content .vl-icon
  -webkit-transition: none;
  transition: none;

.v-btn .v-btn__content .vl-icon
  color: inherit;

.v-btn--floating .vl-icon
  height: inherit;
  width: inherit;

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
