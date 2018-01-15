<template>
  <div class="d-flex flex-column text-center justify-content-center align-items-center mt-4">

    <md-snackbar id="snackbar" md-position="center" :md-active.sync="showSnackbar" md-persistent>
      <span>Unable to complete log in.</span>
      <md-button class="md-primary" @click="showSnackbar = false">Close</md-button>
    </md-snackbar>

    <div>
      <h1 class="md-display-2">Login</h1>
    </div>
    <div id="loginOptions" v-if="!isInternalLogin">
      <!-- divs here keep the buttons aligned -->
      <div>       
        <md-button id="facebook" class="btn-facebook btn-block md-raised" @click.prevent="facebookLogin()"><span class="text-white">Log In with <i class="fa fa-facebook-official" title="Facebook"></i><span class="sr-only">Facebook</span></span></md-button>
      </div>
      <div>
          <md-button id="login" @click.prevent="swapLoginType()" class="btn-block md-raised md-accent">Log In</md-button>
      </div>
      <div class="pt-1">
        <a id="signup" href="#" @click.prevent="toSignUp()" >Not got an account? Sign up</a>
      </div>
    </div>

    <!-- Login Form -->
    <form id="internalLoginForm" class="d-flex flex-column align-items-center justify-content-center w-100" v-if="isInternalLogin">
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
      <div >
        <md-button id="submit" class="md-raised md-accent" :disabled="isDisabled" @click.prevent="tryLogin()">Submit</md-button>
      </div>
      <div>
        <md-button id="back" class="md-raised" @click.prevent="swapLoginType()">Back</md-button>
      </div>
    </form>
  </div>
</template>

<script>
import feathersClient from '@/api/feathers-client'
import {mapActions} from 'vuex'
import router from '@/router'

export default {
  name: 'Login',
  data () {
    return {
      password: '',
      email: '',
      isInternalLogin: false,
      showSnackbar: false
    }
  },
  methods: {
    ...mapActions('auth', ['authenticate', 'logout']),
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
        .catch(error => { console.error(`Login Error: ${error}`); this.showSnackbar = true })
    },
    toSignUp: function () {
      router.push('/signup')
    },
    swapLoginType: function () {
      this.isInternalLogin = !this.isInternalLogin
    },
    facebookLogin: function () {
      let url
      if (process.env.BRANCH === 'develop' && process.env.STAGING === '1') {
        url = 'https://staging-api.jonathansmovies.com/auth/facebook'
      } else if (process.env.NODE_ENV === 'production') {
        url = 'https://api.jonathansmovies.com/auth/facebook'
      } else {
        url = 'http://localhost:3030/auth/facebook'
      }
      this.logout()
        .then(window.location = url)
    },
    getValidationClass: function (input) {
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

<style lang="scss" scoped>
  .btn-facebook {
    background-color: #3b5998 !important;
    border-color: #3b5998 !important;
    color: #ffffff;
  }
</style>
