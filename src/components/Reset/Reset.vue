<template>
  <div class="text-center mt-4">
    <div class="mb-3">
      <h1 class="display-2">Reset Password</h1>
    </div>
    
    <v-card v-if="!token && !showCodeEnter && !showPasswordEntry">
      <v-card-text>
        <v-form>
          <v-text-field prepend-icon="inbox" name="email" label="Email" v-model="email" type="text"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn id="submit" :disabled="isDisabled" @click.prevent="requestReset()" color="primary">Request Reset</v-btn>
        <v-btn flat id="back" to="/login">Back</v-btn>
      </v-card-actions>
    </v-card>

    <div v-if="showCodeEnter && !showPasswordEntry">
      <v-card :value="true" type="info" class="mb-2">
        <v-card-text>
          <p class="body-1 mb-0">An email has been sent to you with a reset code.</p>
        </v-card-text>
      </v-card>

      <v-card >
        <v-card-text>
          <v-form>
            <v-text-field
            name="short-token"
            label="Reset Code"
            mask="######"
            v-model="shortToken"
            type="number"
          ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn id="submitCode" :disabled="shortToken.length != 6" @click.prevent="setCode()" color="primary">Input Code</v-btn>
          <v-btn flat id="back" to="/login">Back</v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <v-card v-if="token || showPasswordEntry">
      <v-card-text>
        <v-form>
          <v-text-field loading @input="checkPasswordStrength" prepend-icon="lock" name="password" label="New Password" v-model="password" id="password"
            :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
            :append-icon-cb="() => (hidePassword = !hidePassword)"
            :type="hidePassword ? 'password' : 'text'">
              <v-progress-linear
                v-show="password"
                slot="progress"
                :value="progress"
                :color="color"
                height="4"
                label="Strength"
              ></v-progress-linear>
          </v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn id="submit" :disabled="!password" @click.prevent="resetPassword()" color="primary">Change Password</v-btn>
        <v-btn flat id="back" to="/login">Back</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import router from '@/router'
import {mapActions} from 'vuex'
import zxcvbn from 'zxcvbn'

import feathersClient from '@/api/feathers-client'
import authClient from '@/api/auth-client'

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
  props: {
    token: {
      type: String
    }
  },
  methods: {
    ...mapActions('snackbar', {setSnackbar: 'setText'}),
    ...mapActions('auth', ['authenticate', 'logout']),
    requestReset () {
      const user = {email: this.email}
      authClient.sendResetPwd(user)
        .then((result) => {
          // Show short token input
          this.showCodeEnter = true
        })
        // one source of error is a not-verified user
        .catch((e) => {
          console.log(e)
          // Show error
          authClient.resendVerifySignup(user)
        })
    },
    setCode () {
      if (this.shortToken.length === 6) {
        this.showPasswordEntry = true
      }
      // TODO some unlikely error handling
    },
    checkPasswordStrength () {
      let result = zxcvbn(this.password)
      this.passwordStrength = result.score
    },
    resetPassword () {
      let promise
      if (this.token) {
        promise = authClient.resetPwdLong(this.token, this.password)
      } else {
        promise = authClient.resetPwdShort(this.shortToken, {email: this.email}, this.password)
      }
      promise
        .then((user) => { this.showConfirm(user) })
        .catch((e) => this.setSnackbar(e))
    },
    showConfirm (user) {
      this.setSnackbar('Password Reset')
      if (user.email && this.password) {
        this.authenticate({
          strategy: 'local',
          email: user.email,
          password: this.password
        })
          .then(token => feathersClient.passport.verifyJWT(token.accessToken))
          .then(() => {
            router.push('home')
          })
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