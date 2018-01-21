<template>
  <div class="">
    <div>
      <h1 class="display-2">Sign Up</h1>
    </div>
    <v-snackbar id="snackbar" bottom v-model="showSnackbar">
      <span>Unable to complete sign up.</span>
    </v-snackbar>

    <form id="internalLoginForm" class="d-flex flex-column align-items-center justify-content-center w-100">
      <v-text-field prepend-icon="inbox" name="email" label="Email" v-model="email" type="text"></v-text-field>
      <v-text-field prepend-icon="lock" name="password" label="Password" v-model="password" id="password" type="password"></v-text-field>

      
      <v-btn id="submit" :disabled="isDisabled" @click.prevent="trySignUp()" color="primary">Signup</v-btn>
      <v-btn id="back" @click.prevent="toHome()">Back</v-btn>
    </form>
  </div>
</template>

<script>
import feathersClient from '@/api/feathers-client'
import {mapActions} from 'vuex'
import router from '@/router'

export default {
  name: 'SignUp',
  data () {
    return {
      password: '',
      email: '',
      showSnackbar: false
    }
  },
  methods: {
    ...mapActions('users', {signUp: 'create'}),
    ...mapActions('auth', ['authenticate']),
    toHome: function () {
      router.push('/home')
    },
    trySignUp: function () {
      const password = this.password
      const email = this.email
      this.signUp({
        strategy: 'local',
        email: email,
        password: password
      })
        .then(() => this.authenticate({
          strategy: 'local',
          email: email,
          password: password
        }))
        .then(token => {
          console.log('Authenticated!', token)
          return feathersClient.passport.verifyJWT(token.accessToken)
        })
        .then(() => router.push('home'))
        .catch(error => { console.error(error); this.showSnackbar = true })
    },
    getValidationClass: function () {
      return true
    }
  },
  computed: {
    isDisabled: function () {
      // W3 Email regex: http://emailregex.com/
      const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      return !(this.password && this.email && regex.test(this.email))
    }
  }
}
</script>
