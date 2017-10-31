<template>
  <div class="d-flex flex-column text-center justify-content-center align-items-center mt-4">
    <div>
      <h1>Login</h1>
    </div>
    <div v-if="isError" class="alert alert-danger" role="alert">
      Oops that username & password combination wasn't quite correct.
    </div>
    <div v-if="!isInternalLogin">
      <mdl-button id="facebook" raised class="btn-facebook btn-block mdl-js-ripple-effect" @click.native.prevent="facebookLogin()">Log In with <i class="fa fa-facebook-official" title="Facebook"></i><span class="sr-only">Facebook</span></mdl-button>
      <p class="py-1 my-1">or</p>
      <mdl-button id="login" @click.native.prevent="swapLoginType()" colored raised class="btn-block mdl-js-ripple-effect">Log In</mdl-button>
      <div class="pt-1">
        <a id="signup" href="#" @click.prevent="toSignUp()" >Not got an account? Sign up</a>
      </div>
    </div>
    <!-- Login Form -->
    <form class="d-flex flex-column align-items-center justify-content-center" v-if="isInternalLogin">
      <div class="w-100">
        <i class="fa fa-inbox px-2 mdl-color-text--grey-600"></i> <mdl-textfield floating-label="Email" type="email" v-model="email" />
      </div>
      <div class="w-100">
        <i class="fa fa-key px-2 mdl-color-text--grey-600"></i> <mdl-textfield floating-label="Password" type="password" v-model="password" />
      </div>
      <mdl-button id="submit" accent raised class="mdl-js-ripple-effect" :disabled="isDisabled" @click.native.prevent="tryLogin()">Submit</mdl-button>
      <mdl-button id="back" class="mdl-js-ripple-effect" @click.native.prevent="swapLoginType()">Back</mdl-button>
    </form>
  </div>
</template>

<script>
import feathersClient from '@/api/feathers-client'
import { MdlButton, MdlTextfield } from 'vue-mdl'
import {mapActions, mapState} from 'vuex'
import router from '@/router'

export default {
  name: 'Login',
  data () {
    return {
      password: '',
      email: '',
      isError: false,
      isInternalLogin: false
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
        .catch(error => { console.error(error); this.isError = true })
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
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    isDisabled: function () {
      // W3 Email regex: http://emailregex.com/
      const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      return !(this.password && this.email && regex.test(this.email))
    }
  },
  components: {
    MdlButton,
    MdlTextfield
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
