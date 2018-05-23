<template>
  <div class="">
    <div>
      <h1 class="display-2">Sign Up</h1>
    </div>
    <form id="internalLoginForm" class="d-flex flex-column align-items-center justify-content-center w-100">
      <v-text-field prepend-icon="inbox" name="email" label="Email" @change="checkUnique" :error-messages="emailErrors" v-model="email" type="text"></v-text-field>
      <v-text-field loading @input="checkPasswordStrength" prepend-icon="lock" name="password" label="Password" v-model="password" id="password"
        :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
        :append-icon-cb="() => (hidePassword = !hidePassword)"
        :type="hidePassword ? 'password' : 'text'">
          <v-progress-linear
            slot="progress"
            :value="progress"
            :color="color"
            height="4"
          ></v-progress-linear>
      </v-text-field>

      
      <v-btn id="submit" :disabled="isDisabled" @click.prevent="trySignUp()" color="primary">Signup</v-btn>
      <v-btn id="back" flat @click.prevent="toHome()">Back</v-btn>
    </form>
  </div>
</template>

<script>
import feathersClient from '@/api/feathers-client'
import authClient from '@/api/auth-client'
import {mapActions} from 'vuex'
import router from '@/router'
import zxcvbn from 'zxcvbn'

export default {
  name: 'SignUp',
  data () {
    return {
      hidePassword: true,
      password: '',
      email: '',
      emailErrors: [],
      passwordStrength: 0
    }
  },
  methods: {
    ...mapActions('users', {signUp: 'create'}),
    ...mapActions('auth', ['authenticate']),
    ...mapActions('snackbar', {setSnackbar: 'setText'}),
    toHome: function () {
      router.push('/home')
    },
    checkUnique: function () {
      authClient.checkUnique({email: this.email})
        .then(() => { this.emailErrors = [] })
        .catch(e => { console.log(e); this.emailErrors = ['This email address is already in use.'] })
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
        .catch(error => { console.error(error); this.setSnackbar('Unable to complete sign up.') })
    },
    checkPasswordStrength () {
      let result = zxcvbn(this.password)
      this.passwordStrength = result.score
    }
  },
  computed: {
    isDisabled: function () {
      // W3 Email regex: http://emailregex.com/
      const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      return !(this.password && this.email && regex.test(this.email))
    },
    color () {
      if (!this.password) {
        return 'grey'
      }
      const colors = ['red', 'orange', 'amber', 'light-green', 'green']
      return colors[this.passwordStrength]
    },
    progress () {
      if (!this.password) {
        return 0
      }
      if (this.passwordStrength === 0) {
        return 3
      }
      return Math.min(100, this.passwordStrength * 25)
    }
  }
}
</script>
