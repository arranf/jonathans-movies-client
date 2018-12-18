<template>
  <div class="text-xs-center mt-4">
    <v-card id="loginForm">
      <div class="pa-2">
        <v-card-title>
          <h1 class="display-1">Login</h1>
          </v-card-title>
        <v-card-text>
            <v-text-field @input="isError = false" :error="isError" prepend-icon="inbox" name="email" label="Email" v-model="email" type="text"></v-text-field>
            <v-text-field @input="isError = false" :error="isError" ref="password" prepend-icon="lock" name="password" label="Password" v-model="password" id="password"
              :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
              @click:append="() => (hidePassword = !hidePassword)"
              :type="hidePassword ? 'password' : 'text'">
            </v-text-field>
            <router-link class="d-flex caption" to="/reset">Forgotten your password?</router-link>
            <v-btn id="submit" :disabled="isDisabled" @click.prevent="tryLogin()" color="primary">Login</v-btn>
          <v-btn block id="facebook" class="btn-facebook mt-2" @click.prevent="facebookLogin()">
            <span class="white--text">Log In with Facebook</span>
          </v-btn>
        </v-card-text>
      </div>
      <div class="pa-4 grey lighten-3">
        <router-link id="signup" to="/signup">Not got an account? Sign up</router-link>
      </div>
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
      isInternalLogin: false,
      isError: false
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
          return feathersClient.passport.verifyJWT(token.accessToken)
        })
        .then(() => {
          router.push('home')
        })
        // eslint-disable-next-line
        .catch(error => {
          this.isError = true
          this.setSnackbar('Unable to complete log in. Please check your username and password.')
        })
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
  max-width: 200px;
  margin: 0 auto;
}
#submit {
  width: 100%;
  max-width: 200px;
}
</style>
