<template>
  <div class="mb-3">
    <h2 class="display-2 mt-4 pb-3">Create a Poll</h2>
    <form autocomplete="off" class="">
      <!-- Prevent auto-complete -->
      <input autocomplete="false" name="hidden" type="text" style="display:none;">

      <movie-suggest :placeholder="movieSuggestPlaceholder" :errors="optionsErrors" @optionsChange="updateOptions"></movie-suggest>

      <v-switch id="nomination-phase" :label="switchLabel" v-model="haveNominations"/>

      <!-- Nominations -->
      <transition name="fade">
        <div v-if="haveNominations">
          <h3 class="subheadingfont">Nomination Phase Options</h3>

          <v-text-field id="nomination-length" :error-messages="nominationLengthErrors" prepend-icon="timelapse" label="Nomination Time" hint="The number of minutes for nominations" v-model="nominationsMinutes" @input="$v.minutes.$touch()" type="number"  pattern="[1-9][0-9]*" min="1" max="60" />
          <v-text-field id="nomination-votes" :error-messages="nominationsErrors" prepend-icon="format_list_numbered" label="Number of Nominations" hint="The number of nominations each person receives" v-model="nominations" @input="$v.votes.$touch()" type="number" pattern="[1-4]" min="1" max="4" />
        </div>
      </transition>

      <div>
        <h3 class="subheadingfont">Voting Phase Options</h3>

        <v-text-field id="minutes" :error-messages="minutesErrors" prepend-icon="timelapse" label="Voting Time" hint="The number of minutes for voting" v-model="minutes" @input="$v.minutes.$touch()" type="number" pattern="[1-9]" min="1" max="10" />
        <v-text-field id="votes" :error-messages="votesErrors" prepend-icon="format_list_numbered" label="Number of Votes" hint="The number of votes each person receives" v-model="votes" @input="$v.votes.$touch()" type="number" pattern="[1-4]" min="1" max="4" />
      </div>
    
      <div class="mt-3">
        <v-btn id="start-poll" @click.prevent="startPoll()" :disabled="!canStart" color="primary">Start Poll</v-btn>
        <v-btn id="back" @click.prevent="toHome()">Back</v-btn>
      </div>
    </form>

    <v-snackbar id="snackbar" :bottom="true" v-model="showSnackbar">
      <span>This movie has already been added.</span>
      <v-btn class="md-primary" @click="showSnackbar = false">Close</v-btn>
    </v-snackbar>
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
    updateOptions: function (options) {
      this.options = options
      this.$v.options.$touch()
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
    },
    switchLabel: function () {
      return this.haveNominations ? 'With Nominations' : 'No Nominations'
    },
    movieSuggestPlaceholder: function () {
      return this.haveNominations ? 'Pre-Select Movies' : 'Select Movies'
    },
    minutesErrors () {
      const errors = []
      const minutes = this.$v.minutes
      if (!minutes.$dirty) return errors
      !minutes.required && errors.push('A number of minutes for voting is required.')
      !minutes.between && errors.push(`Voting length must be between ${minutes.$params.between.min} and ${minutes.$params.between.max}`)
      return errors
    },
    votesErrors () {
      const errors = []
      const votes = this.$v.votes
      if (!votes.$dirty) return errors
      !votes.required && errors.push('A number of votes for voting is required.')
      !votes.between && errors.push(`Voting length must be between ${votes.$params.between.min} and ${votes.$params.between.max}`)
      return errors
    },
    nominationLengthErrors () {
      const errors = []
      const nominationsMinutes = this.$v.nominationsMinutes
      if (!nominationsMinutes.$dirty) return errors
      !nominationsMinutes.required && errors.push('A number of nominationMinutes for voting is required.')
      !nominationsMinutes.between && errors.push(`Voting length must be between ${nominationsMinutes.$params.between.min} and ${nominationsMinutes.$params.between.max}`)
      return errors
    },
    nominationsErrors () {
      const errors = []
      const nominations = this.$v.nominations
      if (!nominations.$dirty) return errors
      !nominations.required && errors.push('A number of nominations for voting is required.')
      !nominations.between && errors.push(`Voting length must be between ${nominations.$params.between.min} and ${nominations.$params.between.max}`)
      return errors
    },
    optionsErrors () {
      const errors = []
      const options = this.$v.options
      if (!options.$dirty) return errors
      !options.required && errors.push('Options are required if there are no nominations')
      !options.minLength && errors.push('You must have at least two options if there are no nominations')
    }
  },
  validations () {
    return {
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