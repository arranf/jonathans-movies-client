<template>
  <div class="container-fluid">
    <div class="row ">
      <div class="col">
        <h2 class="mt-4 pb-3">Create a Poll</h2>
        <form autocomplete="off">
           <input autocomplete="false" name="hidden" type="text" style="display:none;">
          <div class="form-group">
            <div v-for="(option, index) in options" :key="index">
              <div class="row my-1">
                <div class="col col-md-auto">
                  <label :for="index">Option {{ index + 1 }}</label>
                </div>
                <div class="col col-md-4">
                  <input type="text" class="form-control" :id="index" placeholder="The Assassin" v-model="options[index]"></input>
                </div>
              </div> <!-- row -->
            </div>
            <div class="row">
              <div class="col">
                <button type="submit" role="button" class="btn btn-sm btn-primary" @click.prevent="addOption()"><i class="fa fa-plus" aria-disabled="true"><span class="sr-only">Add Option</span></i></button>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="row">
              <div class="col col-md-auto">
                <label for="numberOfMinutes">Number of Minutes</label> 
              </div>
              <div class="col col-md-2">
                <select class="form-control" id="numberOfMinutes" v-model="minutes">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>5</option>
                  <option>8</option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="row">
              <div class="col col-md-auto">
                <label for="numberOfVotes">Number of Votes</label> 
              </div>
              <div class="col col-md-2">
                <select class="form-control" id="numberOfVotes" v-model="votes">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </div>
            </div>
          </div> <!--form-group-->
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col col-md-auto">
        <button type="submit" role="button" class="btn btn-primary" @click.prevent="startPoll()" :disabled="isDisabled">Start Poll!</button>
      </div>
      <div class="col col-md-3">
        <button type="submit" role="button" class="btn btn-outline-secondary" @click.prevent="toHome()">Back to Home</button>
      </div>
    </div>
  </div>
</template>

<script>
import feathersClient from '@/api/feathers-client'
import {mapActions, mapGetters, mapState} from 'vuex'
import router from '@/router'

export default {
  name: 'Create',
  data () {
    return {
      minutes: '3',
      votes: '2',
      options: ['']
    }
  },
  methods: {
    ...mapActions('poll', {createPoll: 'create', updatePoll: 'update'}),
    toHome: function () {
      router.push('/home')
    },
    addOption: function () {
      this.options.push('')
    },
    startPoll: function () {
      const currentTime = parseInt(new Date().getTime())

      this.createPoll({
        numberOfVotes: parseInt(this.votes),
        startDateTime: currentTime,
        endDateTime: currentTime + parseInt(this.minutes) *  60000,
        options: this.options
      })

      router.push('/home')
    }
  },
  computed: {
    ...mapGetters('poll', ['isActivePoll']),
    ...mapState('auth', ['user']),
    isDisabled: function () {
      return !this.minutes  
        || !this.votes 
        || this.options.length < 2 
        || !this.options[0]
        || !this.options[1]
    }
  }
}
</script>
