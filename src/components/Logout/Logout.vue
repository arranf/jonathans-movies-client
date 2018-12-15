<template>
  <div class="d-flex">
    <loading />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Loading from '@/components/skeleton/Loading'

export default {
  name: 'Logout',
  components: {
    Loading
  },
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
