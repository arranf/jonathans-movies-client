<template>
  <div class="container d-flex flex-column align-items-center justify-content-center text-center  mb-3">
    <div class="row">
      <div class="col">
        <h2 class="mt-4 pb-3">Create a Poll</h2>
        <form autocomplete="off">
          <input autocomplete="false" name="hidden" type="text" style="display:none;">
         
          <!-- Options Input -->
          <div class="form-group">
            <div v-for="(option, index) in options" :key="index">
              <div class="row my-2">
                <div class="col-12">
                  <label :for="index">Option {{ index + 1 }}</label>
                </div>
                <div class="col">
                  <movie-suggest :id="index+'-suggest'" :index="index" :needed="!haveNominations" @fill="fillOption"></movie-suggest>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <button type="submit" role="button" class="btn btn-sm btn-primary" @click.prevent="addOption()"><i class="fa fa-plus" aria-disabled="true"><span class="sr-only">Add Option</span></i></button>
              </div>
            </div>
          </div>
          
          <!-- Number of Minutes -->
          <div class="form-group">
            <div class="row">
              <div class="col col-md-auto">
                <label for="numberOfMinutes">Voting Length</label> 
              </div>
              <div class="col col-md-6">
                <div class="input-group">
                  <input name="numberOfMinutes" class="form-control" :class="{'is-invalid': errors.has('numberOfMinutes')}" data-vv-delay="1000" type="number" pattern="[0-9]" min="1" max="10" v-model="minutes" v-validate="'required|decimal:0|min:1|max:10'"></input>
                  <span class="input-group-addon">mins</span>
                </div>
                <div v-show="errors.has('numberOfMinutes')" class="invalid-feedback">
                  Please provide a valid time limit between 1 and 10 mins
                </div>
              </div>
            </div>
          </div>

          <!-- Number of Votes -->
          <div class="form-group">
            <div class="row">
              <div class="col col-md-auto">
                <label for="numberOfVotes">Number of Votes</label> 
              </div>
              <div class="col col-md-6">
                <input name="numberOfVotes" class="form-control" :class="{'is-invalid': errors.has('numberOfVotes')}" data-vv-delay="1000" type="number" pattern="[0-9]" min="1" max="4" v-model="votes" v-validate="'required|decimal:0|min:1|max:4'"></input>
                <div v-show="errors.has('numberOfVotes')" class="invalid-feedback">
                  Please provide a valid number of votes between 1 and 4
                </div>
              </div>
            </div>
          </div>

          <!-- Nominations Checkbox -->
          <div class="form-group">
            <div class="row">
              <div class="col col-md-auto">
                <label class="custom-control custom-checkbox">
                  <input type="checkbox" class="custom-control-input" v-model="haveNominations">
                  <span class="custom-control-indicator"></span>
                  <span class="custom-control-description">Let's have a nomination phase!</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Nomination Length -->
          <div class="form-group" v-if="haveNominations">
            <div class="row">
              <div class="col col-md-auto">
                <label for="nominationLength">Nomination Length</label>
              </div>
              <div class="col col-md-6">
                <div class="input-group">
                  <input name="nominationLength" class="form-control" :class="{'is-invalid': errors.has('nominationLength')}" data-vv-delay="1000" type="number" pattern="[0-9]*" min="1" max="60" v-model="nominationsMinutes" v-validate="nominationLengthRules">
                  <span class="input-group-addon">mins</span>
                </div>
                <div v-show="errors.has('nominationLength')" class="invalid-feedback">
                  Please provide a valid nomination time limit between 1 and 60 mins
                </div>
              </div>
            </div>
          </div>

          <!-- Number of Nomination -->
          <div class="form-group" v-if="haveNominations">
            <div class="row">
              <div class="col col-md-auto">
                <label for="numberOfNominations">Number of Nominations</label>
              </div>
              <div class="col col-md-auto">
                <input name="numberOfNominations" class="form-control" :class="{'is-invalid': errors.has('numberOfNominations')}" data-vv-delay="1000" type="number" pattern="[0-9]" min="1" max="5" v-model="nominations" v-validate="numberOfNominationsRules">
                <div v-show="errors.has('numberOfNominations')" class="invalid-feedback">
                  Please provide a valid number of nominations between 1 and 4
                </div>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
    <div class="row">
      <div class="col col-md-auto">
        <button type="submit" role="button" class="btn btn-primary" @click.prevent="startPoll()" :disabled="!canStart">Start Poll!</button>
      </div>
      <div class="col col-md-3">
        <button type="submit" role="button" class="btn btn-outline-secondary" @click.prevent="toHome()">Back</button>
      </div>
    </div>
  </div>
</template>

<script>
import MovieSuggest from './MovieSuggest'
import feathersClient from '@/api/feathers-client'
import {mapActions, mapGetters, mapState} from 'vuex'
import router from '@/router'

export default {
  name: 'Create',
  components: {
    MovieSuggest
  },
  data () {
    return {
      minutes: '3',
      votes: '2',
      haveNominations: false,
      nominationsMinutes: '5',
      nominations: '1',
      options: [{name: "", film_id: null}]
    }
  },
  methods: {
    ...mapActions('poll', {createPoll: 'create', updatePoll: 'update'}),
    toHome: function () {
      router.push('/home')
    },
    addOption: function () {
      this.options.push({name: "", film_id: null})
    },
    fillOption: function (index, film) {
      this.$set(this.options, index, film)
    },
    startPoll: function () {
      const currentTime = parseInt(new Date().getTime())
      let pollTransitionDateTime
      let numberOfNominations
      let endDateTime = currentTime + parseInt(this.minutes) *  60000

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
        options: this.options.filter(o => o
          && typeof o === 'object' && o.name.trim().length > 0
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
      return this.minutes  
        && this.votes 
        && ( // Either have appropriate options...
          (this.options.length >= 2
          && this.options[0]
          && this.options[1]
          && this.options[0].name.trim().length > 0
          && this.options[1].name.trim().length > 0)
          || // ...or setup a nomination phase 
          (this.haveNominations
          && this.nominationsMinutes
          && this.nominations)
        )
    },
    nominationLengthRules: function () {
      return this.haveNominations ? 'required|decimal:0|min:1|max:60' : ''
    },
    numberOfNominationsRules: function () {
      return this.haveNominations ? 'required|decimal:0|min:1|max:4' : ''
    }
  }
}
</script>
