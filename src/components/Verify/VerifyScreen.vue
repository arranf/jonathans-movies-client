<template>
  <div class="d-flex">
    <loading />
  </div>
</template>

<script>
import feathersClient from "@/api/feathers-client";
import authClient from "@/api/auth-client";
import Loading from "@/components/skeleton/LoadingSpinner";
import { mapActions } from "vuex";
import router from "@/router";

export default {
  name: "VerifyScreen",
  components: {
    Loading,
  },
  props: {
    token: {
      type: String,
    },
  },
  methods: {
    ...mapActions("auth", ["authenticate", "logout"]),
    ...mapActions("snackbar", { setSnackbar: "setText" }),
    // TODO: MAKE THIS REUSABLE
    tryLogin: function () {
      this.authenticate({
        strategy: "local",
        email: this.email,
        password: this.password,
      })
        .then(() => {
          router.push("home");
        })
        .catch((error) => {
          console.error(`Login Error: ${error}`);
          this.setSnackbar("Unable to complete log in.");
        });
    },
    verify: function () {
      authClient
        .verifySignupLong(this.token)
        .then((user) => {
          this.setSnackbar("You are now verified! 🎉");
          router.push({ name: "Login", query: { email: user.email } });
        })
        .catch(() => {
          this.setSnackbar("Could not verify you. Are you already verified?");
          router.push("/home");
        });
    },
  },
  mounted() {
    if (!this.token) {
      router.push("/");
    } else {
      this.verify();
    }
  },
};
</script>
