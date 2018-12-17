<script>
import quotes from './quotes'
import { selectRandom } from '@/utils'

export default {
  functional: true,
  render (h, context) {
    const quote = selectRandom(quotes)
    const flexClasses = 'flex xs12'
    const headingClasses = 'mt-2 subheading'
    const spanClasses = 'body-2'

    const h4 = h('h4', { staticClass: headingClasses }, quote.quotation)
    const span = h('span',
      { staticClass: spanClasses },
      [
        h('em', '-'),
        ` ${quote.film} (${quote.year})`
      ]
    )

    return h('div', { staticClass: flexClasses },
      [
        h('hr'),
        h4,
        span
      ])
  }
}
</script>
