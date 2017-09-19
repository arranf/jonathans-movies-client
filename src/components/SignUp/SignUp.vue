<template>
  <div class="container h-100 mt-4">
      <div class="row h-100 justify-content-center align-items-center">
          <div class="col">
              <div>
                  <h1>Sign Up!</h1>
              </div>
              <div v-if="isError" class="alert alert-danger" role="alert">
                  Whoops! Looks like one or both of your fields are invalid.
              </div>
              <form>
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
                <button type="submit" @click.prevent="trySignUp()" class="btn btn-primary" :disabled="isDisabled">Submit</button>
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
  name: 'SignUp',
  data() {
      return {
          password: '',
          email: '',
          isError: false
      }
  },
  methods: {
      ...mapActions('users', {signUp: 'create'}),
      ...mapActions('auth', ['authenticate']),
      trySignUp: function() {
          this.signUp({
              strategy: 'local',
              email: this.email,
              password: this.password
          })
          .then( () => this.authenticate({
              strategy: 'local',
              email: this.email,
              password: this.password
          }))
          .then(token => {
            console.log('Authenticated!', token);
            return feathersClient.passport.verifyJWT(token.accessToken);
          })
          .then( () => {
              console.log('User', this.current); 
              router.push('home')
          })
          .catch(error => {console.error(error); this.isError = true})
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
