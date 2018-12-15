<template>
  <v-flex xs12 >
    <hr />
    <h4 class="mt-2 subheading">{{quote.quotation}}</h4>
    <span class="body-2"><em>—</em> {{quote.film}} ({{quote.year}})</span>
  </v-flex>
</template>

<script>
import quotes from './quotes'
import { selectRandom } from '@/utils'

export default {
  computed: {
    quote () {
      return selectRandom(quotes)
    }
  }
}
</script>
