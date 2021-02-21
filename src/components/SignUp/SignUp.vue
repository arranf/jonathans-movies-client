<template>
  <v-card>
    <div class="pa-2">
      <v-card-title>
        <h1 class="display-1">Sign Up</h1>
      </v-card-title>
      <v-card-text id="internalLoginForm">
        <v-form>
          <v-text-field
            v-model="email"
            prepend-icon="inbox"
            name="email"
            label="Email"
            hint="Used to reset your password if you forget it."
            :error-messages="emailErrors"
            type="text"
            @change="checkUnique"
          ></v-text-field>
          <v-text-field
            id="password"
            v-model="password"
            loading
            prepend-icon="lock"
            name="password"
            label="Password"
            :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
            :type="hidePassword ? 'password' : 'text'"
            @input="checkPasswordStrength"
            @click:append="() => (hidePassword = !hidePassword)"
          >
            <v-progress-linear
              slot="progress"
              :value="progress"
              :color="color"
              height="4"
            ></v-progress-linear>
          </v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          id="submit"
          :disabled="isDisabled || !emailIsUnique"
          color="primary"
          @click.prevent="trySignUp()"
          >Signup</v-btn
        >
        <v-btn id="back" flat @click.prevent="toHome()">Back</v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
import authClient from "@/api/auth-client";
import { mapActions } from "vuex";
import router from "@/router";
import zxcvbn from "zxcvbn";

export default {
  name: "SignUp",
  data() {
    return {
      hidePassword: true,
      password: "",
      email: "",
      emailErrors: [],
      passwordStrength: 0,
      emailIsUnique: true,
    };
  },
  methods: {
    ...mapActions("users", { signUp: "create" }),
    ...mapActions("auth", ["authenticate"]),
    ...mapActions("snackbar", { setSnackbar: "setText" }),
    toHome: function () {
      router.push("/home");
    },
    checkUnique: function () {
      authClient
        .checkUnique({ email: this.email })
        .then(() => {
          this.emailErrors = [];
          this.emailIsUnique = true;
        })
        .catch((e) => {
          console.error(e);
          this.emailErrors = ["This email address is already in use."];
          this.emailIsUnique = false;
        });
    },
    trySignUp: function () {
      const password = this.password;
      const email = this.email;
      this.signUp({
        strategy: "local",
        email: email,
        password: password,
      })
        .then(() =>
          this.authenticate({
            strategy: "local",
            email: email,
            password: password,
          })
        )
        .then(() => router.push("home"))
        .catch((error) => {
          let message = "Unable to complete sign up.";
          if (Object.prototype.hasOwnProperty.call(error, "message")) {
            message += error.message;
          }
          this.setSnackbar(message);
        });
    },
    checkPasswordStrength() {
      let result = zxcvbn(this.password);
      this.passwordStrength = result.score;
    },
  },
  computed: {
    isDisabled: function () {
      // W3 Email regex: http://emailregex.com/
      const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      return !(this.password && this.email && regex.test(this.email));
    },
    color() {
      if (!this.password) {
        return "grey";
      }
      const colors = ["red", "orange", "amber", "light-green", "green"];
      return colors[this.passwordStrength];
    },
    progress() {
      if (!this.password) {
        return 0;
      }
      if (this.passwordStrength === 0) {
        return 3;
      }
      return Math.min(100, this.passwordStrength * 25);
    },
  },
};
</script>
