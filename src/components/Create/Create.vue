<template>
  <div class="d-flex flex-column align-items-center justify-content-start mb-3">
    <h2 class="mt-4 pb-3">Create a Poll</h2>
    <form autocomplete="off" class="d-flex flex-column align-items-start justify-content-center w-100">
      <!-- Prevent auto-complete -->
      <input autocomplete="false" name="hidden" type="text" style="display:none;">

      <div class="md-layout-row md-gutter w-100">
        <div class="md-layout-item md-size-100">
          <movie-suggest @fill="fillOption"></movie-suggest>
        </div>
      </div>

      <!-- options -->
      <div class="md-layout-row md-gutter w-100" v-if="options.length > 0" id="options-container">
        <div class="md-layout-item md-size-100">
          <p>{{haveNominations ? 'Pre-Selected Movies' : 'Selected Movies' }}</p>
          <div id="options">
            <md-chip v-for="(option, index) in options" :key="option.name" class="md-primary" md-deletable @md-delete="removeOption(index)">{{option.name}}</md-chip>
          </div>
        </div>
      </div>

      <div class="md-layout-row md-gutter w-100">
        <div class="md-layout-item md-size-100">
          <md-field>
            <md-icon>timelapse</md-icon>
            <label for="minutes">Voting Time</label>
            <md-input name="minutes" id="minutes" v-model="minutes" type="number"  pattern="[1-9]" min="1" max="10" />
            <span class="md-helper-text">Number of minutes</span>
          </md-field>
        </div>
      </div>

      <div class="md-layout-row md-gutter w-100">
        <div class="md-layout-item md-size-100">
          <md-field>
            <md-icon>format_list_numbered</md-icon>
            <label for="votes">Number of Votes</label>
            <md-input name="votes" id="votes" v-model="votes" type="number" pattern="[1-4]" min="1" max="4" />
          </md-field>
        </div>
      </div>

      <!-- Nominations -->
      <md-switch id="nomination-phase" v-model="haveNominations">{{haveNominations ? 'With Nominations' : 'No Nominations' }}</md-switch>

      <transition name="fade">
        <div v-if="haveNominations" class="md-layout md-gutter">
          <div class="md-layout-item md-size-100">
            <h2 class="md-subheading">Nomination Options</h2>
          </div>

          <div class="md-layout-item md-size-100 pa-1">
            <md-field>
              <md-icon>timelapse</md-icon>
              <label for="nomination-length">Nomination Time</label>
              <md-input name="nomination-length" id="nomination-length" v-model="nominationsMinutes" type="number" pattern="[1-9][0-9]*" min="1" max="60" />
              <span class="md-helper-text">Number of minutes</span>
            </md-field>
          </div>
          
          <div class="md-layout-item md-size-100 pa-1">
            <md-field>
              <md-icon>format_list_numbered</md-icon>
              <label for="nomination-votes">Number of Nominations</label>
              <md-input name="nomination-votes" id="nomination-votes" v-model="nominations" type="number" pattern="[1-4]" min="1" max="4" />
            </md-field>
          </div>
        </div>
      </transition>
    
    <div class="mt-3">
      <md-button id="start-poll" class="md-raised md-accent" @click.prevent="startPoll()" :disabled="!canStart">Start Poll</md-button>
      <md-button @click.prevent="toHome()">Back</md-button>
    </div>

    </form>
  </div>
</template>

<script>
import MovieSuggest from './MovieSuggest'
import {mapActions} from 'vuex'
import router from '@/router'
export default {
  name: 'Create',
  components: {
    MovieSuggest
  },
  data () {
    return {
      minutes: '3',
      votes: '1',
      haveNominations: false,
      nominationsMinutes: '5',
      nominations: '2',
      options: []
    }
  },
  methods: {
    ...mapActions('poll', {createPoll: 'create'}),
    toHome: function () {
      router.push('/home')
    },
    fillOption: function (film) {
      this.options.push({name: film.name, film_id: film.film_id})
    },
    removeOption: function (index) {
      this.options.splice(index, 1)
    },
    startPoll: function () {
      const currentTime = parseInt(new Date().getTime())
      let pollTransitionDateTime
      let numberOfNominations
      let endDateTime = currentTime + parseInt(this.minutes) * 60000
      if (this.haveNominations) {
        const nominationLengthSeconds = parseInt(this.nominationsMinutes) * 60000
        pollTransitionDateTime = currentTime + nominationLengthSeconds
        numberOfNominations = parseInt(this.nominations)
        endDateTime += nominationLengthSeconds
      }
      this.createPoll({
        numberOfVotes: parseInt(this.votes),
        startDateTime: currentTime,
        endDateTime: endDateTime,
        options: this.options.filter(o => o &&
          typeof o === 'object' && o.name.trim().length > 0
        ),
        pollTransitionDateTime: pollTransitionDateTime,
        numberOfNominations: numberOfNominations
      })
      this.toHome()
    }
  },
  computed: {
    canStart: function () {
      return this.minutes &&
        this.votes &&
        ( // Either have appropriate options...
          (this.options.length >= 2 &&
          this.options[0] &&
          this.options[1] &&
          this.options[0].name.trim().length > 0 &&
          this.options[1].name.trim().length > 0) || // ...or setup a nomination phase
          (this.haveNominations &&
          this.nominationsMinutes &&
          this.nominations)
        )
    }
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>