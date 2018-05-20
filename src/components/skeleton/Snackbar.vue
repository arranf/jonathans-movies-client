
<template>
  <v-snackbar v-model="show">
    {{message}}
    <v-btn flat color="accent" @click.native="show = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: 'Snackbar',
  data () {
    return {
      show: false,
      message: ''
    }
  },
  created () {
    this.$store.watch(state => state.snackbar.text, () => {
      const msg = this.$store.state.snackbar.text
      if (msg !== '') {
        this.show = true
        this.message = this.$store.state.snackbar.text
        this.$store.commit('snackbar/setSnack', '')
      }
    })
  }
}
</script>