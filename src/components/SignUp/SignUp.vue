<template>
  <div class="flex-column d-flex text-center justify-content-center align-items-center mt-4">
    <div>
        <h1>Sign Up</h1>
    </div>
    <mdl-snackbar display-on="signUpError"></mdl-snackbar>
    <form class="d-flex flex-column align-items-center justify-content-center">
      <div class="w-100">
        <i class="fa fa-inbox px-2 mdl-color-text--grey-600"></i> <mdl-textfield floating-label="Email" type="email" v-model="email" />
      </div>
      <div class="w-100">
        <i class="fa fa-key px-2 mdl-color-text--grey-600"></i> <mdl-textfield floating-label="Password" type="password" v-model="password" />
      </div>
      <mdl-button id="submit" accent raised class="mdl-js-ripple-effect" :disabled="isDisabled" @click.native.prevent="trySignUp()">Submit</mdl-button>
      <mdl-button id="back" class="mdl-js-ripple-effect" @click.native.prevent="toHome()">Back</mdl-button>
    </form>
  </div>
</template>

<script>
import feathersClient from '@/api/feathers-client'
import { MdlButton, MdlTextfield, MdlSnackbar } from 'vue-mdl'
import {mapActions, mapState} from 'vuex'
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
      email: ''
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
        .catch(error => { console.error(error); this.$root.$emit('signUpError', { message: 'Unable to complete sign up' }) })
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    isDisabled: function () {
      return !(this.password && this.email)
    }
  }
}
</script>
