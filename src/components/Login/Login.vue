<template>
  <div class="container d-flex text-center justify-content-center align-items-center mt-4">
      <div class="row h-100 ">
          <div class="col">
              <div>
                  <h1>Login</h1>
              </div>
              <div v-if="isError" class="alert alert-danger" role="alert">
                Oops that username & password combination wasn't quite correct.
              </div>
              <div v-if="!isInternalLogin">
                <a href="https://api.jonathansmovies.com/auth/auth0" class="btn btn-primary btn-block">Log with <i class="fa fa-facebook-official" title="Facebook"></i><span class="sr-only">Facebook</span> or <i class="fa fa-google" title="Google" aria-disabled="true"></i> <span class="sr-only">Google</span></a>
                <p class="py-1 my-1">or</p>
                <button @click="swapLoginType()" class="btn btn-secondary btn-block">Log in with a regular account</button>
                <small><a href="#" @click.prevent="toSignUp()">Not got an account? Sign up</a></small>
              </div>
              <form v-if="isInternalLogin">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input name="email" v-validate="'required|email'" data-vv-delay="1000"  type="email" class="form-control" :class="{'is-invalid': errors.has('email')}" v-model="email" id="email" aria-describedby="emailHelp" placeholder="Enter email">
                    <div v-if="errors.has('email')" class="invalid-feedback">
                        Please provide a valid email address.
                    </div>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input name="password" v-validate="'required'"  type="password" v-model="password" class="form-control" :class="{'is-invalid': errors.has('password')}"  id="password" placeholder="Password">
                    <div v-if="errors.has('password')" class="invalid-feedback">
                        Please enter a password
                    </div>
                </div>
                    <button type="submit" @click.prevent="tryLogin()" class="btn btn-primary" :disabled="isDisabled">Submit</button>
                    <button role="button" class="btn btn-outline-secondary" @click="swapLoginType()">Back</button>
                </form>
          </div>
      </div>
  </div>
</template>

<script>
import feathersClient from '@/api/feathers-client'
import {mapActions, mapGetters, mapState} from 'vuex'
import router from '@/router'

export default {
  name: 'Login',
    data() {
        return {
            password: '',
            email: '',
            isError: false,
            isInternalLogin: false
        }
    },
    methods: {
        ...mapActions('auth',['authenticate']),
        tryLogin: function() {
            this.authenticate({
                strategy: 'local',
                email: this.email,
                password: this.password
            })
            .then(token => {
                console.log('Authenticated!', token);
                return feathersClient.passport.verifyJWT(token.accessToken);
            })
            .then( () => {
                console.log('User', this.current); 
                router.push('home')
            })
            .catch(error => {console.error(error); this.isError = true})
        },
        toSignUp: function() {
            router.push('/signup')
        },
        swapLoginType: function() {
          this.isInternalLogin = !this.isInternalLogin
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
