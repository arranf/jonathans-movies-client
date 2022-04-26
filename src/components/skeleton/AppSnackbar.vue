import { mapState } from 'vuex';
<template>
  <v-snackbar v-model="show">
    {{ message }}
    <v-btn flat color="accent" :timeout="duration" @click.native="show = false"
      >Close</v-btn
    >
  </v-snackbar>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "AppSnackbar",
  data() {
    return {
      show: false,
      message: "",
      duration: 6000,
    };
  },
  computed: {
    ...mapState("snackbar", ["isPersistent"]),
  },
  created() {
    this.$store.watch(
      (state) => state.snackbar.text,
      () => {
        const msg = this.$store.state.snackbar.text;
        if (msg !== "") {
          this.show = true;
          this.message = this.$store.state.snackbar.text;
          this.duration = this.isPersistent ? 60000 : 6000; // 60s or 6s
          this.$store.commit("snackbar/setSnack", "");
        }
      }
    );
  },
};
</script>
