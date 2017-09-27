<template>
  <div class="card bg-dark text-white">
    <img class="card-img" src="https://unsplash.it/800/200" alt="Card image">
    <div class="card-img-overlay">
      <h4 class="card-title">{{film.name}}</h4>
      <p class="card-text">Last Watched {{lastWatched}}</p>
    </div>
  </div>
</template>

<script>
import utils from '@/utils'

export default {
  name: 'OptionPreview',
  props: ['film'],
  data() {
    return {
    }
  },
  computed: {
    lastWatched: function () {return utils.humanizeTimeToNowImprecise(this.film.lastWatched) + ' ago'}
  }
}
</script>