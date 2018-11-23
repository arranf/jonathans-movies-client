<template>
  <div class="text-center mt-4">
    <div class="mb-3">
      <h1 class="display-2">Login</h1>
    </div>
    <div id="loginOptions" v-if="!isInternalLogin">
      <!-- divs here keep the buttons aligned -->
      <div>
        <v-btn block id="facebook" class="btn-facebook" @click.prevent="facebookLogin()"><span class="text-white">Log In with Facebook</span>
        </v-btn>
      </div>
      <div>
          <v-btn block id="login" @click.prevent="swapLoginType()" >Log In</v-btn>
      </div>
      <div class="pt-1">
        <a id="signup" href="#" @click.prevent="toSignUp()" >Not got an account? Sign up</a>
      </div>
    </div>

    <v-card id="internalLoginForm" v-if="isInternalLogin">
      <v-card-text>
        <v-form>
          <v-text-field prepend-icon="inbox" name="email" label="Email" v-model="email" type="text"></v-text-field>
          <v-text-field ref="password" prepend-icon="lock" name="password" label="Password" v-model="password" id="password"
            :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
            @click:append="() => (hidePassword = !hidePassword)"
            :type="hidePassword ? 'password' : 'text'">
          </v-text-field>
          <router-link class="d-flex caption" to="/reset">Forgotten your password?</router-link>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn id="submit" :disabled="isDisabled" @click.prevent="tryLogin()" color="primary">Login</v-btn>
        <v-btn flat id="back" @click.prevent="swapLoginType()">Back</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import feathersClient from '@/api/feathers-client'
import { mapActions } from 'vuex'
import router from '@/router'

export default {
  name: 'Login',
  data () {
    return {
      hidePassword: true,
      password: '',
      email: '',
      isInternalLogin: false
    }
  },
  methods: {
    ...mapActions('auth', ['authenticate', 'logout']),
    ...mapActions('snackbar', { setSnackbar: 'setText' }),
    tryLogin: function () {
      this.authenticate({
        strategy: 'local',
        email: this.email,
        password: this.password
      })
        .then(token => {
          console.log('Authenticated!', token)
          return feathersClient.passport.verifyJWT(token.accessToken)
        })
        .then(() => {
          router.push('home')
        })
        .catch(error => {
          console.error(error)
          console.error(`Login Error: ${error}`)
          this.setSnackbar('Unable to complete log in.')
        })
    },
    toSignUp: function () {
      router.push('/signup')
    },
    swapLoginType: function () {
      this.isInternalLogin = !this.isInternalLogin
    },
    facebookLogin: function () {
      let url
      if (process.env.BRANCH === 'develop') {
        url = 'https://staging-api.jonathansmovies.com/auth/facebook'
      } else if (process.env.NODE_ENV === 'production') {
        url = 'https://api.jonathansmovies.com/auth/facebook'
      } else {
        url = 'http://localhost:3030/auth/facebook'
      }
      this.logout()
        .then((window.location = url))
        .catch(e => console.error(e))
    }
  },
  computed: {
    isDisabled: function () {
      // W3 Email regex: http://emailregex.com/
      const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      return !(this.password && this.email && regex.test(this.email))
    }
  },
  mounted () {
    if (this.$route.query.email) {
      this.email = this.$route.query.email
      this.isInternalLogin = true

      // hack to wait for child component to render
      setTimeout(() => {
        this.$refs.password.focus()
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-facebook {
  background-color: #3b5998 !important;
  border-color: #3b5998 !important;
  color: #ffffff;
}
</style>
