<template>
<div class="text-center mx-auto w-100">
  <ul class="progressbar d-block" v-if="getPollFinishingUpTo(10)">
    <li v-if="doesCurrentPollHaveNominations" class="active">Nominations</li>
    <li :class="{ active: isVotingCurrentOrOverForPollFinishingUpTo(10) }">Voting</li>
    <li :class="{ active: isItResultsForPollFinishingUpTo(10) }">Results</li>
  </ul>
</div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'ProgressIndicator',
  computed: {
    ...mapGetters('poll', ['doesCurrentPollHaveNominations', 'isVotingCurrentOrOverForPollFinishingUpTo', 'getPollFinishingUpTo', 'isItResultsForPollFinishingUpTo'])
  }
}
</script>

<style scoped>
/* http://kodhus.com/newsite/step-progress-bar-css-only/ */

  .progressbar {
      counter-reset: step;
  }
  .progressbar li {
      list-style-type: none;
      width: 25%;
      float: left;
      font-size: 12px;
      position: relative;
      text-align: center;
      text-transform: uppercase;
      color: #7d7d7d;
  }
  .progressbar li:before {
      width: 30px;
      height: 30px;
      content: counter(step);
      counter-increment: step;
      line-height: 30px;
      border: 2px solid #7d7d7d;
      display: block;
      text-align: center;
      margin: 0 auto 10px auto;
      border-radius: 50%;
      background-color: white;
  }
  .progressbar li:after {
      width: 100%;
      height: 2px;
      content: '';
      position: absolute;
      background-color: #7d7d7d;
      top: 15px;
      left: -50%;
      z-index: -1;
  }
  .progressbar li:first-child:after {
      content: none;
  }
  .progressbar li.active {
      color: green;
  }
  .progressbar li.active:before {
      border-color: #55b776;
  }
  .progressbar li.active + li:after {
      background-color: #55b776;
  }
</style>
