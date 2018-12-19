<script>
export default {
  functional: true,
  props: {

  },
  render (h, { props, children }) {
    const classes = {
      'vl-card': true,
      'vl-card--flat': props.flat,
      'vl-card--hover': props.hover,
      'vl-card--raised': props.raised,
      'vl-card--tile': props.tile
    }
    return h('div', { staticClass: 'vl-card theme--light', classes }, children)
  }
}
</script>

<style lang="stylus">
@require '../../assets/styles/vuetify-lite/theme.styl'
// primary transition
@require '../../assets/styles/vuetify-lite/settings/_variables/_transition.styl'
// elevation($)
@require '../../assets/styles/vuetify-lite/generic/_elevation.styl'

// taken from _variables
$card-border-radius := 2px

vl-card($material)
  background-color: $material.cards
  border-color: $material.cards
  color: $material.text.primary

theme(vl-card, "vl-card")

.v-dialog--fullscreen
  .vl-card
    min-height: 100%;
    min-width: 100%;
    margin: 0 !important;
    padding: 0 !important;

.vl-card
  display: block
  border-radius: $card-border-radius
  min-width: 0
  position: relative
  text-decoration: none
  transition: $primary-transition
  elevation(1)

  > *:first-child:not(.v-btn):not(.v-chip)
    border-top-left-radius: inherit
    border-top-right-radius: inherit

  > *:last-child:not(.v-btn):not(.v-chip)
    border-bottom-left-radius: inherit
    border-bottom-right-radius: inherit

  &--raised
    elevation(3)

  &--tile
    border-radius: 0

  &--flat
    elevation(0)

  &--hover
    cursor: pointer
    transition: all .4s cubic-bezier(.25, .8, .25, 1)
    transition-property: box-shadow

    &:hover
      elevation(8)

  &__title
    align-items: center
    display: flex
    flex-wrap: wrap
    padding: 16px

    &--primary
      padding-top: 24px

  &__text
    padding: 16px
    width: 100%

  &__actions
    align-items: center
    display: flex
    padding: 8px

    > *,
    .v-btn
      margin: 0

    .v-btn + .v-btn
      margin-left: 8px
</style>
