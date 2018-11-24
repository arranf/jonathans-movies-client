<template>
  <div class="d-flex">
    <v-progress-circular class="align-self-center" indeterminate color="primary" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Logout',
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('snackbar', { setSnackbar: 'setText' }),
    logoutAndRedirect: function () {
      this.logout()
        .then(() => this.setSnackbar('You are now logged out!'))
        .then(() => this.$router.push({ path: '/' }))
        .catch(e => console.error(e))
    }
  },
  mounted () {
    this.logoutAndRedirect()
  }
}
</script>
