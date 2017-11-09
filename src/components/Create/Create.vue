<template>
  <div class="d-flex flex-column align-items-center justify-content-center text-center mb-3">
    <h2 class="mt-4 pb-3">Create a Poll</h2>
    <form autocomplete="off">
      <!-- Prevent automcomplete -->
      <input autocomplete="false" name="hidden" type="text" style="display:none;">
         
      <!-- Options Input -->
      <div v-for="(option, index) in options" :key="index">
        <div class="w-100 my-2">
          <movie-suggest :id="index+'-suggest'" :index="index" :needed="!haveNominations" @fill="fillOption"></movie-suggest>
        </div>
      </div>
      <div class="w-100">
          <mdl-button colored id="addAnother" class="mdl-js-ripple-effect" @click.native.prevent="addOption()"><i class="fa fa-plus" aria-disabled="true"><span class="sr-only">Add Option</span></i></mdl-button>  
      </div>
      
      <div class="w-100">
        <mdl-textfield floating-label="Voting Length" type="number" pattern="[1-9]" min="1" max="10" error="Provide a number of minutes between 1 and 9" v-model="minutes" />
      </div>

      <div class="w-100">
        <mdl-textfield floating-label="Number of Votes" type="number" pattern="[1-4]" min="1" max="4" error="Provide a number of votes between 1 and 4" v-model="votes" />
      </div>

      <div class="w-100">
        <mdl-switch id="nomination-phase" v-model="haveNominations">{{haveNominations ? 'Have Nominations' : 'Don\'t Have Nominations' }}</mdl-switch>
      </div>

      <div v-if="haveNominations">
        <div class="w-100">
          <mdl-textfield floating-label="Nominations Length" type="number" pattern="[1-9][0-9]*" min="1" max="60" error="Provide a number of minutes between 1 and 60" v-model="nominationsMinutes" />
        </div>

        <div class="w-100">
          <mdl-textfield floating-label="Number of Votes" type="number" pattern="[1-4]" min="1" max="4" error="Provide a number of nominations between 1 and 4" v-model="nominations" />
        </div>
      </div>
    </form>
    <div class="w-100">
      <mdl-button accent raised class="mdl-js-ripple-effect" @click.native.prevent="startPoll()" :disabled="!canStart">Start Poll</mdl-button>
      <mdl-button class="mdl-js-ripple-effect" @click.native.prevent="toHome()">Back</mdl-button>
    </div>
  </div>
</template>

<script>
import { MdlButton, MdlTextfield, MdlSwitch } from 'vue-mdl'
import MovieSuggest from './MovieSuggest'
import {mapActions, mapGetters, mapState} from 'vuex'
import router from '@/router'

export default {
  name: 'Create',
  components: {
    MovieSuggest,
    MdlButton,
    MdlTextfield,
    MdlSwitch
  },
  data () {
    return {
      minutes: '3',
      votes: '2',
      haveNominations: false,
      nominationsMinutes: '5',
      nominations: '1',
      options: [{name: '', film_id: null}]
    }
  },
  methods: {
    ...mapActions('poll', {createPoll: 'create', updatePoll: 'update'}),
    addOption: function () {
      this.options.push({name: '', film_id: null})
    },
    fillOption: function (index, film) {
      this.$set(this.options, index, film)
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
      router.push('/home')
    }
  },
  computed: {
    ...mapGetters('poll', ['getActivePoll']),
    ...mapState('auth', ['user']),
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
