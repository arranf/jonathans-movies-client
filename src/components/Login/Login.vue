<template>
  <div class="container h-100">
      <div class="row h-100 justify-content-center align-items-center">
          <div class="col">
              <form>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" v-model="email" id="email" aria-describedby="emailHelp" placeholder="Enter email">
                    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" v-model="password" class="form-control" id="password" placeholder="Password">
                </div>
                <button type="submit" @click="tryLogin()" class="btn btn-primary">Submit</button>
                </form>
          </div>
      </div>
  </div>
</template>

<script>
import feathersClient from '@/api/feathers-client'
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'Login',
  data() {
      return {
          password: '',
          email: ''
      }
  },
  methods: {
      ...mapActions('auth',['authenticate']),
      tryLogin: function() {
          debugger
          const email = this.email
          const password = this.password 
          this.authenticate({
               strategy: 'local',
               email: email,
               password: password
          })
          .then(response => {
            console.log('Authenticated!', response);
            return client.passport.verifyJWT(response.accessToken);
          })
          .then(console.log('User', this.current()))
          .catch(error => console.error(error))
      }
  },
  computed: {
      ...mapGetters('user', ['current'])
  }
}
</script>
