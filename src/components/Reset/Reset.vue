<template>
  <div class="text-center mt-4">
    <div class="mb-3">
      <h1 class="display-2">Reset Password</h1>
    </div>
    <v-card>
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
  </div>
</template>

<script>
import authClient from '@/api/auth-client'
import {mapActions} from 'vuex'

export default {
  name: 'Reset',
  data () {
    return {
      email: ''
    }
  },
  methods: {
    ...mapActions('snackbar', {setSnackbar: 'setText'}),
    requestReset () {
      const user = {email: this.email}
      authClient.sendResetPwd(user)
        .then((result) => console.log(result))
        // one source of error is a not-verified user
        .catch((e) => authClient.resendVerifySignup(user))
    }
  },
  computed: {
    isDisabled: function () {
      // W3 Email regex: http://emailregex.com/
      const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      return !(this.email && regex.test(this.email))
    }
  }
}
</script>