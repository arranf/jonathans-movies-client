<template>
  <div class="flex-column d-flex text-center justify-content-center align-items-center mt-4">
    <div>
      <h1 class="md-display-2">Sign Up</h1>
    </div>
    <md-snackbar id="snackbar" md-position="center" :md-active.sync="showSnackbar" md-persistent>
      <span>Unable to complete sign up.</span>
      <md-button class="md-primary" @click="showSnackbar = false">Close</md-button>
    </md-snackbar>

    <form id="internalLoginForm" class="d-flex flex-column align-items-center justify-content-center w-100">
      <div class="md-layout-row md-gutter w-100">
        <div class="md-layout-item md-size-100">
          <md-field :class="getValidationClass('email')" md-clearable md-inline>
            <md-icon>inbox</md-icon>
            <label for="email">Email</label>
            <md-input name="email" id="email" v-model="email" type="email" />
          </md-field>
        </div>
      </div>

      <div class="md-layout-row md-gutter w-100">
        <div class="md-layout-item md-size-100">
          <md-field :class="getValidationClass('password')" md-inline>
            <md-icon>vpn_key</md-icon>
            <label for="password">Password</label>
            <md-input name="password" id="password" v-model="password" type="password" />
          </md-field>
        </div>
      </div>

      <md-button id="submit" class="md-raised md-accent" :disabled="isDisabled" @click.prevent="trySignUp()">Submit</md-button>
      <md-button id="back" class="md-raised" @click.prevent="toHome()">Back</md-button>
    </form>
  </div>
</template>

<script>
import feathersClient from '@/api/feathers-client'
import { MdlButton, MdlTextfield, MdlSnackbar } from 'vue-mdl'
import {mapActions} from 'vuex'
import router from '@/router'

export default {
  name: 'SignUp',
  components: {
    MdlButton,
    MdlTextfield,
    MdlSnackbar
  },
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
