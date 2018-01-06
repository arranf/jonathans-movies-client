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
      <div class="mt-2 mb-4 md-layout-row md-gutter w-100" v-if="options.length > 0" id="options-container">
        <div class="md-layout-item md-size-100">
          <p>{{haveNominations ? 'Pre-Selected Movies' : 'Selected Movies' }}</p>
          <div id="options">
            <md-chip v-for="(option, index) in options" :key="option.name" class="md-primary my-1" md-deletable @md-delete="removeOption(index)">{{option.name}}</md-chip>
          </div>
        </div>
      </div>

      <div class="md-layout-row md-gutter w-100">
        <div class="md-layout-item md-size-100">
          <md-field :class="formClass('minutes')">
            <md-icon>timelapse</md-icon>
            <label for="minutes">Voting Time</label>
            <md-input name="minutes" id="minutes" v-model="minutes" @input="$v.minutes.$touch()" type="number"  pattern="[1-9]" min="1" max="10" />
            <span class="md-helper-text">Number of minutes</span>
            <span class="md-error" v-if="!$v.minutes.between || !$v.minutes.required">{{getErrorText('minutes')}}</span>
          </md-field>
        </div>
      </div>

      <div class="md-layout-row md-gutter w-100">
        <div class="md-layout-item md-size-100">
          <md-field :class="formClass('votes')">
            <md-icon>format_list_numbered</md-icon>
            <label for="votes">Number of Votes</label>
            <md-input name="votes" id="votes" v-model="votes"  type="number" @input="$v.votes.$touch()" pattern="[1-4]" min="1" max="4" />
            <span class="md-error" v-if="!$v.votes.between || !$v.votes.required">{{getErrorText('votes')}}</span>
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
            <md-field :class="formClass('nominationsMinutes')">
              <md-icon>timelapse</md-icon>
              <label for="nomination-length">Nomination Time</label>
              <md-input name="nomination-length" id="nomination-length" v-model="nominationsMinutes" @input="$v.nominationsMinutes.$touch()" type="number" pattern="[1-9][0-9]*" min="1" max="60" />
              <span class="md-helper-text">Number of minutes</span>
              <span class="md-error" v-if="!$v.nominationsMinutes.between || !$v.nominationsMinutes.required">{{getErrorText('nominationsMinutes')}}</span>
            </md-field>
          </div>
          
          <div class="md-layout-item md-size-100 pa-1">
            <md-field :class="formClass('nominations')">
              <md-icon>format_list_numbered</md-icon>
              <label for="nomination-votes">Number of Nominations</label>
              <md-input name="nomination-votes" id="nomination-votes" v-model="nominations" @input="$v.nominations.$touch()" type="number" pattern="[1-4]" min="1" max="4" />
              <span class="md-error" v-if="!$v.nominations.between || !$v.nominations.required">{{getErrorText('nominations')}}</span>
            </md-field>
          </div>
        </div>
      </transition>
    
    <div class="mt-3">
      <md-button id="start-poll" class="md-raised md-accent" @click.prevent="startPoll()" :disabled="!canStart">Start Poll</md-button>
      <md-button id="back" @click.prevent="toHome()">Back</md-button>
    </div>

     <md-snackbar id="snackbar" md-position="center" :md-active.sync="showSnackbar" md-persistent>
      <span>This movie has already been added.</span>
      <md-button class="md-primary" @click="showSnackbar = false">Close</md-button>
    </md-snackbar>

    </form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, requiredIf, between, minLength } from 'vuelidate/lib/validators'
import MovieSuggest from './MovieSuggest'
import {mapActions} from 'vuex'
import router from '@/router'
export default {
  name: 'Create',
  components: {
    MovieSuggest
  },
  mixins: [validationMixin],
  data () {
    return {
      minutes: '3',
      votes: '1',
      haveNominations: false,
      nominationsMinutes: '5',
      nominations: '2',
      options: [],
      showSnackbar: false
    }
  },
  methods: {
    ...mapActions('poll', {createPoll: 'create'}),
    toHome: function () {
      router.push('/home')
    },
    fillOption: function (film) {
      if (!this.options.find(f => f.name === film.name)) {
        this.options.push({name: film.name, film_id: film.film_id})
      } else {
        this.showSnackbar = true
      }
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
    },
    formClass (formItemName) {
      // debugger
      if (!this.$v[formItemName]) {
        return {}
      }
      return {
        'md-invalid': this.$v[formItemName].$error
      }
    },
    getErrorText (formItemName) {
      let error = ''
      let validation = this.$v[formItemName]
      if (!validation.required) {
        error = 'Required'
      } else if (!validation.between) {
        error = `Must be between ${validation.$params.between.min} and ${validation.$params.between.max}`
      }
      return error
    }
  },
  computed: {
    canStart: function () {
      return !this.$v.$invalid
    }
  },
  validations: {
    minutes: {
      required,
      between: between(1, 10)
    },
    votes: {
      required,
      between: between(1, 4)
    },
    nominationsMinutes: {
      required: requiredIf(function () {
        return this.haveNominations
      }),
      between: between(1, 60)
    },
    nominations: {
      required: requiredIf(function () {
        return this.haveNominations
      }),
      between: between(1, 4)
    },
    options: {
      required: requiredIf(function () {
        return !this.haveNominations
      }),
      minLength: !this.haveNominations ? minLength(2) : minLength(0)
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