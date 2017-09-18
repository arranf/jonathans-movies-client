<template>
  <div class="container h-100">
      <div class="row h-100 justify-content-center align-items-center">
          <div class="col">
              <div v-if="isError" class="alert alert-danger" role="alert">
                Oops that username & password combination wasn't quite correct.
              </div>
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
                <button type="submit" @click.prevent="tryLogin()" class="btn btn-primary">Submit</button>
                </form>
          </div>
      </div>
  </div>
</template>

<script>
import feathersClient from '@/api/feathers-client'
import {mapActions, mapGetters} from 'vuex'
import router from '@/router'

export default {
  name: 'Login',
  data() {
      return {
          password: '',
          email: '',
          isError: false
      }
  },
  methods: {
      ...mapActions('auth',['authenticate']),
      tryLogin: function() {
          const email = this.email
          const password = this.password 
          this.authenticate({
               strategy: 'local',
               email: email,
               password: password
          })
          .then(response => {
            console.log('Authenticated!', response);
            return feathersClient.passport.verifyJWT(response.accessToken);
          })
          .then( () => {
              console.log('User', this.current); 
              router.push('home')
          })
          .catch(error => {console.error(error); this.isError = true})
      }
  },
  computed: {
      ...mapGetters('users', ['current'])
  },
  created: function() {
      feathersClient.passport.getJWT()
      .then( token => feathersClient.passport.verifyJWT(token))
      .then( () => {
              console.log('User', this.current); 
              router.push('home')
          })
  }
}
</script>
