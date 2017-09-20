<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1>Hey, Jonathan!</h1>
        <button type="button" class="btn btn-primary" v-if="!creatingPoll" @click.prevent="newPoll()">New Poll</button>
        <form v-if="creatingPoll">
          <div class="form-group">
            <div v-for="(option, index) in options" :key="index">
              <div class="row">
                <div class="col col-md-auto">
                  <label :for="index">Option {{ index + 1 }}</label>
                </div>
                <div class="col">
                  <input type="text" class="form-control" :id="index" :placeholder="option"></input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col col-md-auto">
                <label :for="options.length + 1">Option {{ options.length + 1 }}</label>
              </div>
              <div class="col">
                <input type="text" class="form-control" :id="options.length" v-model="newOption" placeholder="Enter a film title here..."></input>
              </div>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" @click.prevent="addOption()">Add Option</button>          
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import feathersClient from '@/api/feathers-client'
import {mapActions} from 'vuex'
import router from '@/router'

export default {
  name: 'Admin',
  data () {
    return {
      newOption: '',
      creatingPoll: false,
      options: []
    }
  },
  methods: {
    ...mapActions('polls', ['create']),
    newPoll: function () {
      this.creatingPoll = true
    },
    addOption: function () {
      this.options.push(this.newOption)
      this.newOption = ''
    }
  }
}
</script>
