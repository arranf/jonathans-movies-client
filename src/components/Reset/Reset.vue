<template>
  <div class="text-xs-center mt-4">
    <div class="mb-3">
      <h1 class="display-2">Reset Password</h1>
    </div>

    <card v-if="!token && !showCodeEnter && !showPasswordEntry">
      <card-text>
          <v-text-field prepend-icon="inbox" name="email" label="Email" v-model="email" type="text"></v-text-field>
      </card-text>
      <card-actions>
        <spacer />
        <v-btn id="submit" :disabled="isDisabled" @click.prevent="requestReset()" color="primary">Request Reset</v-btn>
        <v-btn flat id="back" to="/">Back</v-btn>
      </card-actions>
    </card>

    <div v-if="showCodeEnter && !showPasswordEntry">
      <card :value="true" type="info" class="mb-2">
        <card-text>
          <p class="body-1 mb-0">An email has been sent to you with a reset code.</p>
        </card-text>
      </card>

      <card >
        <card-text>
            <v-text-field
            name="short-token"
            label="Reset Code"
            mask="######"
            v-model="shortToken"
            type="number"
          ></v-text-field>
        </card-text>
        <card-actions>
          <spacer />
          <v-btn id="submitCode" :disabled="shortToken.length != 6" @click.prevent="setCode()" color="primary">Input Code</v-btn>
          <v-btn flat id="back" to="/">Back</v-btn>
        </card-actions>
      </card>
    </div>

    <card v-if="token || showPasswordEntry">
      <card-text>
          <v-text-field loading @input="checkPasswordStrength" prepend-icon="lock" name="password" label="New Password" v-model="password" id="password"
            :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
            @click:append="() => (hidePassword = !hidePassword)"
            :type="hidePassword ? 'password' : 'text'">
              <progress-linear
                v-if="password"
                slot="progress"
                :progress="progress"
                :color="color"
                height="4"
              ></progress-linear>
          </v-text-field>
      </card-text>
      <card-actions>
        <spacer />
        <v-btn id="submit" :disabled="!password" @click.prevent="resetPassword()" color="primary">Change Password</v-btn>
        <v-btn flat id="back" to="/">Back</v-btn>
      </card-actions>
    </card>
  </div>
</template>

<script>
import router from '@/router'
import { mapActions } from 'vuex'
import zxcvbn from 'zxcvbn'

import feathersClient from '@/api/feathers-client'
import authClient from '@/api/auth-client'

import Card from '@/components/Lite/Card'
import CardActions from '@/components/Lite/Card/Actions'
import CardText from '@/components/Lite/Card/Text'
import Spacer from '@/components/Lite/Spacer'
const ProgressLinear = () => import('@/components/common/ProgressLinear')

export default {
  name: 'Reset',
  data () {
    return {
      email: '',
      showCodeEnter: false,
      shortToken: '',
      hidePassword: true,
      showPasswordEntry: false,
      password: '',
      passwordStrength: 0
    }
  },
  components: {
    ProgressLinear,
    Spacer,
    Card,
    CardActions,
    CardText
  },
  props: {
    token: {
      type: String
    }
  },
  methods: {
    ...mapActions('snackbar', { setSnackbar: 'setText' }),
    ...mapActions('auth', ['authenticate', 'logout']),
    requestReset () {
      const user = { email: this.email }
      authClient
        .sendResetPwd(user)
        .then(result => {
          // Show short token input
          this.showCodeEnter = true
        })
        .catch(e => {
          console.error(e)
          // one potential source of error is a not-verified user
          if (e.message.includes('User is not verified')) {
            this.setSnackbar(
              'Check your email to verify your email address before resetting your password.'
            )
          } else {
            this.setSnackbar('Something went wrong. Please try again.')
          }
          // Show error
          authClient.resendVerifySignup(user)
        })
    },
    setCode () {
      if (this.shortToken.length === 6) {
        this.showPasswordEntry = true
      }
      // TODO: some unlikely error handling
    },
    checkPasswordStrength () {
      const result = zxcvbn(this.password)
      this.passwordStrength = result.score
    },
    resetPassword () {
      let promise
      if (this.token) {
        promise = authClient.resetPwdLong(this.token, this.password)
      } else {
        promise = authClient.resetPwdShort(
          this.shortToken,
          { email: this.email },
          this.password
        )
      }
      promise
        .then(user => {
          this.showConfirm(user)
        })
        .catch(e => {
          console.error(e)
          this.setSnackbar(e.message)
        })
    },
    showConfirm (user) {
      this.setSnackbar('Password reset! 🙌')
      if (user && user.email && this.password) {
        this.authenticate({
          strategy: 'local',
          email: user.email,
          password: this.password
        })
          .then(token => {
            feathersClient.passport.verifyJWT(token.accessToken)
          })
          .then(() => {
            router.push('/home')
          })
          .catch(e => console.error(e))
      }
    }
  },
  computed: {
    isDisabled: function () {
      // W3 Email regex: http://emailregex.com/
      const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      return !(this.email && regex.test(this.email))
    },
    color () {
      const colors = ['red', 'orange', 'amber', 'light-green', 'green']
      return colors[this.passwordStrength]
    },
    progress () {
      if (this.passwordStrength === 0) {
        return 3
      }
      return Math.min(100, this.passwordStrength * 25)
    }
  }
}
</script>
