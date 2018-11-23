<template>
  <div class="d-flex">
    <v-progress-circular class="align-self-center" indeterminate color="primary" />
  </div>
</template>

<script>
import feathersClient from '@/api/feathers-client'
import authClient from '@/api/auth-client'
import { mapActions } from 'vuex'
import router from '@/router'

export default {
  name: 'Verify',
  data () {
    return {}
  },
  props: {
    token: {
      type: String
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
          console.error(`Login Error: ${error}`)
          this.setSnackbar('Unable to complete log in.')
        })
    },
    verify: function () {
      authClient
        .verifySignupLong(this.token)
        .then(user => {
          this.setSnackbar('You are now verified! 🎉')
          router.push({ name: 'Login', query: { email: user.email } })
        })
        .catch(() => {
          this.setSnackbar('Could not verify you. Are you already verified?')
          router.push('/home')
        })
    }
  },
  mounted () {
    if (!this.token) {
      router.push('/')
    } else {
      this.verify()
    }
  }
}
</script>
