<template >
  <div class="w-100 my-1">
    <ul class="progressbar" v-if="getPollFinishingUpTo(10)">
      <li v-if="doesCurrentPollHaveNominations" :class="{'w-33': !doesCurrentPollHaveNominations}" class="active">Nomination</li>
      <li :class="{ active: isVotingCurrentOrOverForPollFinishingUpTo(10), 'w-33': !doesCurrentPollHaveNominations }">Voting</li>
      <li :class="{ active: isItResultsForPollFinishingUpTo(10), 'w-33': !doesCurrentPollHaveNominations }">Results</li>
      <li :class="{'w-33': !doesCurrentPollHaveNominations}">Watch</li>
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
      width: 100%;
      counter-reset: step;
      padding-left: 0;
      padding-top: 0.5em;
      margin-left: auto;
      margin-right: auto;
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
  /* Circle */
  .progressbar li:before {
      width: 3em;
      height: 3em;
      content: counter(step);
      counter-increment: step;
      line-height: 3em;
      border: 2px solid #7d7d7d;
      display: block;
      text-align: center;
      margin: 0 auto 10px auto;
      border-radius: 50%;
      background-color: white;
  }
  /* Line */
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
      background-color: #55b776;
      color: white;
  }
  .progressbar li.active + li:after {
      background-color: #55b776;
  }

</style>
