<template>
  <div class="mb-3">
    <h2 class="display-2 mt-4 pb-3">Create a Poll</h2>

    <v-card>
      <v-card-title class="title font-weight-regular justify-space-between">
        <span>{{ currentTitle }}</span>
      </v-card-title>

      <v-window v-model="step">

        <!-- Nominations or not -->
        <v-window-item :value="1">
          <v-card-text>
            <div class="caption grey--text text--darken-1 mb-2">
              Should this poll have a nominations phase to allow other users to suggest movies?
            </div>

            <v-radio-group v-model="haveNominations" row>
              <v-radio
              label="Nominations"
              :value="true"
              ></v-radio>
              <v-radio
                label="No Nominations"
                :value="false"
              ></v-radio>
            </v-radio-group>
          </v-card-text>
        </v-window-item>

        <!-- Nomination options -->
        <v-window-item :value="2">
          <v-card-text>
            <v-text-field id="nomination-length" :error-messages="nominationLengthErrors" prepend-icon="timelapse" label="Nomination Length" hint="The duration of the nomination phase (in minutes)" v-model="nominationsMinutes" @input="$v.nominationsMinutes.$touch()" type="number"  pattern="[1-9][0-9]*" min="1" max="60" />
            <v-text-field id="nomination-votes" :error-messages="nominationsErrors" prepend-icon="format_list_numbered" label="Number of Nominations Per User" hint="The number of nominations each person can make" v-model="nominations" @input="$v.nominations.$touch()" type="number" pattern="[1-4]" min="1" max="4" />

          </v-card-text>
        </v-window-item>

        <!-- Add Movies -->
        <v-window-item :value="3">
          <v-card-text>
            <movie-suggest :placeholder="movieSuggestPlaceholder" :errors="optionsErrors" @optionsChange="updateOptions"></movie-suggest>
            <span v-if="haveNominations" class="caption grey--text text--darken-1">
              Optionally pre-select some movies to add to the pool of nominations.
            </span>
            <span v-else class="caption grey--text text--darken-1">
              Choose the movies to be voted on.
            </span>
          </v-card-text>
        </v-window-item>

        <!-- Voting Phase Options -->
        <v-window-item :value="4">
          <v-card-text>
            <v-text-field id="minutes" :error-messages="minutesErrors" prepend-icon="timelapse" label="Voting Length" hint="The duration of voting (in minutes)" v-model="minutes" @input="$v.minutes.$touch()" type="number" pattern="[1-9]" min="1" max="10" />
            <v-text-field id="votes" :error-messages="votesErrors" prepend-icon="format_list_numbered" label="Number of Votes Per User" hint="The number of votes each person receives" v-model="votes" @input="$v.votes.$touch()" type="number" pattern="[1-4]" min="1" max="4" />
          </v-card-text>
        </v-window-item>

        <!-- Summary -->
        <v-window-item :value="5">
          <v-card-text>
            <span class="grey--text text--darken-1">Voting Length: <span class="greytext--darken-3">{{minutes}}</span> <small>m</small></span><br />
            <span class="grey--text text--darken-1">Vote Count: <span class="text--darken-3">{{votes}}</span></span><br />
            <span class="grey--text text--darken-1">Nomination Length: <span class="text--darken-3">{{nominationsMinutes}}</span> <small>m</small></span><br />
            <span class="grey--text text--darken-1">Nomination Count: <span class="text--darken-3">{{nominations}}</span></span><br />
          </v-card-text>
        </v-window-item>
      </v-window>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn
          :disabled="step === 1"
          flat
          @click="stepBack"
        >
          Back
        </v-btn>
        <spacer></spacer>
        <v-btn
          :disabled="!canNextStep"
          color="primary"
          depressed
          @click="stepFoward"
        >
          {{step === 5 ? 'Start Poll': 'Next'}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { validationMixin } from 'vuelidate'
import {
  required,
  requiredIf,
  between,
  minLength,
  minValue
} from 'vuelidate/lib/validators'
import MovieSuggest from './MovieSuggest'
import Spacer from '@/components/Lite/Spacer'
import router from '@/router'

export default {
  name: 'Create',
  components: {
    MovieSuggest,
    Spacer
  },
  mixins: [validationMixin],
  data () {
    return {
      step: 1,
      minutes: '3',
      votes: '2',
      haveNominations: false,
      nominationsMinutes: '5',
      nominations: '1',
      options: [],
      stepMap: { 1: 'Include Nominations', 2: 'Nomination Options', 3: 'Select Movies', 4: 'Voting Options', 5: 'Confirm' }
    }
  },
  methods: {
    ...mapActions('snackbar', { setSnackbarText: 'setText' }),
    stepBack: function () {
      if (this.step === 3 && !this.haveNominations) { this.step = 1 } else { this.step-- }
    },
    stepFoward: function () {
      if (this.step === 1 && !this.haveNominations) { this.step = 3 } else if (this.step === 5) { this.startPoll() } else { this.step++ }
    },
    toHome: function () {
      router.push('/home')
    },
    updateOptions: function (options) {
      this.options = options
      this.$v.options.$touch()
    },
    startPoll: function () {
      const currentTime = parseInt(new Date().getTime())
      let pollTransitionDateTime
      let numberOfNominations
      let endDateTime = currentTime + parseInt(this.minutes) * 60000
      if (this.haveNominations) {
        const nominationLengthSeconds =
          parseInt(this.nominationsMinutes) * 60000
        pollTransitionDateTime = currentTime + nominationLengthSeconds
        numberOfNominations = parseInt(this.nominations)
        endDateTime += nominationLengthSeconds
      }
      const { Poll } = this.$FeathersVuex

      new Poll({
        numberOfVotes: parseInt(this.votes),
        startDateTime: currentTime,
        endDateTime: endDateTime,
        options: this.options.filter(
          o => o && typeof o === 'object' && o.name.trim().length > 0
        ),
        pollTransitionDateTime: pollTransitionDateTime,
        numberOfNominations: numberOfNominations
      }).create()
      this.setSnackbarText('Poll started!')
      this.toHome()
    }
  },
  computed: {
    currentTitle () {
      return this.stepMap[this.step]
    },
    canNextStep: function () {
      switch (this.step) {
        case 2: return !this.$v.nominationGroup.$invalid
        case 3: return !this.$v.options.$invalid
        case 4: return !this.$v.votingGroup.$invalid
        case 5:
        default: return true
      }
    },
    canStart: function () {
      return !this.$v.$invalid
    },
    movieSuggestPlaceholder: function () {
      return this.haveNominations ? 'Pre-Select Movies' : 'Select Movies'
    },
    minutesErrors () {
      const errors = []
      const minutes = this.$v.minutes
      if (!minutes.$dirty) return errors
      !minutes.required &&
        errors.push('A number of minutes for voting is required.')
      !minutes.between &&
        errors.push(
          `Voting length must be between ${minutes.$params.between.min} and ${
            minutes.$params.between.max
          }`
        )
      return errors
    },
    votesErrors () {
      const errors = []
      const votes = this.$v.votes
      if (!votes.$dirty) return errors
      !votes.required &&
        errors.push('A number of votes for voting is required.')
      !votes.min &&
        errors.push(
          `The number of votes each person receives must be at least ${votes.$params.min.min}`
        )
      return errors
    },
    nominationLengthErrors () {
      const errors = []
      const nominationsMinutes = this.$v.nominationsMinutes
      if (!nominationsMinutes.$dirty) return errors
      !nominationsMinutes.required &&
        errors.push('A number of minutes for nominations is required.')
      !nominationsMinutes.between &&
        errors.push(
          `Nomination length must be between ${
            nominationsMinutes.$params.between.min
          } and ${nominationsMinutes.$params.between.max}`
        )
      return errors
    },
    nominationsErrors () {
      const errors = []
      const nominations = this.$v.nominations
      if (!nominations.$dirty) return errors
      !nominations.required &&
        errors.push('A number of nominations for voting is required.')
      !nominations.min &&
        errors.push(
          `The number of nominations must be at least ${nominations.$params.min.min}`
        )
      return errors
    },
    optionsErrors () {
      const errors = []
      const options = this.$v.options
      if (!options.$dirty) return errors
      !options.required &&
        errors.push('Options are required if there are no nominations')
      !options.minLength &&
        errors.push(
          'You must have at least two options if there are no nominations'
        )
    }
  },
  // TODO: Make sure server side validation matches
  validations () {
    return {
      minutes: {
        required,
        between: between(1, 10)
      },
      votes: {
        required,
        min: this.nominations ? minValue(this.nominations) : minValue(1)
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
        min: minValue(1)
      },
      options: {
        required: requiredIf(function () {
          return !this.haveNominations
        }),
        minLength: !this.haveNominations ? minLength(2) : minLength(0)
      },
      votingGroup: ['minutes', 'votes'],
      nominationGroup: ['nominations', 'nominationsMinutes']
    }
  }
}
</script>
