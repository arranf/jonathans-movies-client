<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1>Hey, Jonathan!</h1>
        <form>
          <div class="form-group">
            <div v-for="(option, index) in options" :key="index">
              <div class="row">
                <div class="col col-md-auto">
                  <label :for="index">Option {{ index + 1 }}</label>
                </div>
                <div class="col">
                  <input type="text" class="form-control" :id="index" placeholder="Enter a film title here..." v-model="options[index]"></input>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="row">
              <div class="col col-md-auto">
                <label for="numberOfMinutes">Number of Minutes</label> 
              </div>
              <div class="col">
                <select class="form-control col-2" id="numberOfMinutes" v-model="minutes">
                  <option>1</option>
                  <option>2</option>
                  <option>5</option>
                  <option>7</option>
                  <option>10</option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="row">
              <div class="col col-md-auto">
                <label for="numberOfVotes">Number of Votes</label> 
              </div>
              <div class="col">
                <select class="form-control col-2" id="numberOfVotes" v-model="votes">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </div>
            </div>
          </div>       
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <button type="submit" class="btn btn-primary" @click.prevent="addOption()">Add Option</button>
        <button type="submit" class="btn btn-primary" @click.prevent="startPoll()" :disabled="isDisabled">Start Poll!</button>
      </div>
      <div class="col"
        <button type="submit" class="btn btn-primary" @click.prevent="toHome()">Back to Home</button>
      </div>
    </div> 
  </div>
</template>

<script>
import feathersClient from '@/api/feathers-client'
import {mapActions, mapGetters, mapState} from 'vuex'
import router from '@/router'

export default {
  name: 'Admin',
  data () {
    return {
      minutes: '',
      votes: '',
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
      return this.minutes === '' 
        || this.votes === ''
        || this.options[0] === ''  
    }
  }
}
</script>
