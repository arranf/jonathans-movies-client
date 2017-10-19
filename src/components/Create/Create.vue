<template>
  <div class="container-fluid">
    <div class="row ">
      <div class="col">
        <h2 class="mt-4 pb-3">Create a Poll</h2>
        <form autocomplete="off">
          <input autocomplete="false" name="hidden" type="text" style="display:none;">
         
          <!-- Options Input -->
          <div class="form-group">
            <div v-for="(option, index) in options" :key="index">
              <div class="row my-1">
                <div class="col col-md-auto">
                  <label :for="index">Option {{ index + 1 }}</label>
                </div>
                <div class="col col-md-4">
                  <movie-suggest :id="index+'-suggest'" :index="index" @fill="fillOption"></movie-suggest>
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
                <label for="numberOfMinutes">Number of Minutes</label> 
              </div>
              <div class="col col-md-2">
                <input class="form-control" id="numberOfMinutes" type="number" pattern="[0-9]" min="1" max="10" v-model="minutes"></input>
              </div>
            </div>
          </div>

          <!-- Number of Votes -->
          <div class="form-group">
            <div class="row">
              <div class="col col-md-auto">
                <label for="numberOfVotes">Number of Votes</label> 
              </div>
              <div class="col col-md-2">
                <input class="form-control" id="numberOfVotes" type="number" pattern="[0-9]" min="1" max="4" v-model="votes"></input>
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
                <label for="nominationLength">Nomination Time Limit (mins)</label>
              </div>
              <div class="col col-md-2">
                <input class="form-control" id="nominationLength" type="number" pattern="[0-9]*" min="1" max="60" v-model="nominationsMinutes">
              </div>
            </div>
          </div>

          <!-- Number of Nomination -->
          <div class="form-group" v-if="haveNominations">
            <div class="row">
              <div class="col col-md-auto">
                <label for="numberOfNominations">Number of Nominations</label>
              </div>
              <div class="col col-md-2">
                <input class="form-control" id="numberOfNominations" type="number" pattern="[0-9]" min="1" max="5" v-model="nominations">
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
    <div class="row">
      <div class="col col-md-auto">
        <button type="submit" role="button" class="btn btn-primary" @click.prevent="startPoll()" :disabled="isDisabled">Start Poll!</button>
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
import utils from '@/utils'

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
      nominationsMinutes: '3',
      nominations: '3',
      options: [{name: "", film_id: null}],
      placeholders: ['The Assassin', 'Zoolander 2', 'Titanic 2', 'Beauty and the Beast']
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
      this.options[index] = film
    },
    startPoll: function () {
      const currentTime = parseInt(new Date().getTime())
      this.createPoll({
        numberOfVotes: parseInt(this.votes),
        startDateTime: currentTime,
        endDateTime: currentTime + parseInt(this.minutes) *  60000,
        options: this.options.filter(o => o
          && (typeof o === 'object' || o.trim().length > 0)
        )
      })
      router.push('/home')
    },
    getRandomPlaceholder: function () {
      return utils.selectRandom(this.placeholders)
    }
  },
  computed: {
    ...mapGetters('poll', ['getActivePoll']),
    ...mapState('auth', ['user']),
    isDisabled: function () {
      return !this.minutes  
        || !this.votes 
        || this.options.length < 2
        || !this.options[0]
        || !this.options[1]
        || (!this.options[0].name.trim().length > 0)
        || (!this.options[1].name.trim().length > 0)
    }
  }
}
</script>
