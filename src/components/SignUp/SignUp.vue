<template>
  <v-card>
    <div class="pa-2">
      <v-card-title>
        <h1 class="display-1">Sign Up</h1>
        </v-card-title>
    <v-card-text id="internalLoginForm" >
      <v-text-field prepend-icon="inbox" name="email" label="Email" hint="Used to reset your password if you forget it." @change="checkUnique" :error-messages="emailErrors" v-model="email" type="text"></v-text-field>
      <v-text-field loading @input="checkPasswordStrength" prepend-icon="lock" name="password" label="Password" v-model="password" id="password"
        :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
        @click:append="() => (hidePassword = !hidePassword)"
        :type="hidePassword ? 'password' : 'text'">
          <progress-linear
            slot="progress"
            :progress="progress"
            :color="color"
            :height="4"
          ></progress-linear>
      </v-text-field>
    </v-card-text>
      <v-card-actions>
        <spacer />
        <v-btn id="submit" :disabled="isDisabled || !emailIsUnique" @click.prevent="trySignUp()" color="primary">Signup</v-btn>
        <v-btn id="back" flat @click.prevent="toHome()">Back</v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
import feathersClient from '@/api/feathers-client'
import authClient from '@/api/auth-client'
import { mapActions } from 'vuex'
import router from '@/router'
import zxcvbn from 'zxcvbn'
import Spacer from '@/components/Lite/Spacer'
const ProgressLinear = () => import('@/components/common/ProgressLinear')

export default {
  name: 'SignUp',
  components: {
    ProgressLinear,
    Spacer
  },
  data () {
    return {
      hidePassword: true,
      password: '',
      email: '',
      emailErrors: [],
      passwordStrength: 0,
      emailIsUnique: true
    }
  },
  methods: {
    ...mapActions('users', { signUp: 'create' }),
    ...mapActions('auth', ['authenticate']),
    ...mapActions('snackbar', { setSnackbar: 'setText' }),
    toHome: function () {
      router.push('/home')
    },
    checkUnique: function () {
      authClient
        .checkUnique({ email: this.email })
        .then(() => {
          this.emailErrors = []
          this.emailIsUnique = true
        })
        .catch(e => {
          console.error(e)
          this.emailErrors = ['This email address is already in use.']
          this.emailIsUnique = false
        })
    },
    trySignUp: function () {
      const password = this.password
      const email = this.email
      this.signUp({
        strategy: 'local',
        email: email,
        password: password
      })
        .then(() =>
          this.authenticate({
            strategy: 'local',
            email: email,
            password: password
          })
        )
        .then(token => {
          return feathersClient.passport.verifyJWT(token.accessToken)
        })
        .then(() => router.push('home'))
        .catch(error => {
          let message = 'Unable to complete sign up.'
          if (error.hasOwnProperty('message')) {
            message += error.message
          }
          this.setSnackbar(message)
        })
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
