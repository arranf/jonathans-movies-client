<template>
  <div class="text-center mt-4">
    <div class="mb-3">
      <h1 class="display-2">Reset Password</h1>
    </div>

    <v-card v-if="!token && !showCodeEnter && !showPasswordEntry">
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="email"
            prepend-icon="inbox"
            name="email"
            label="Email"
            type="text"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          id="submit"
          :disabled="isDisabled"
          :loading="isLoading"
          color="primary"
          @click.prevent="requestReset()"
          >Request Reset</v-btn
        >
        <v-btn id="back" flat to="/">Back</v-btn>
      </v-card-actions>
    </v-card>

    <div v-if="showCodeEnter && !showPasswordEntry">
      <v-card :value="true" type="info" class="mb-2">
        <v-card-text>
          <p class="body-1 mb-0">
            An email has been sent to you with a reset code.
          </p>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="shortToken"
              name="short-token"
              label="Reset Code"
              mask="######"
              type="number"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            id="submitCode"
            :disabled="shortToken.length != 6"
            color="primary"
            @click.prevent="setCode()"
            >Input Code</v-btn
          >
          <v-btn id="back" flat to="/">Back</v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <v-card v-if="token || showPasswordEntry">
      <v-card-text>
        <v-form>
          <v-text-field
            id="password"
            v-model="password"
            loading
            prepend-icon="lock"
            name="password"
            label="New Password"
            :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
            :type="hidePassword ? 'password' : 'text'"
            @input="checkPasswordStrength"
            @click:append="() => (hidePassword = !hidePassword)"
          >
            <v-progress-linear
              v-show="password"
              slot="progress"
              :value="progress"
              :color="color"
              height="4"
              label="Strength"
            ></v-progress-linear>
          </v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          id="submit"
          :loading="isLoading"
          :disabled="!password"
          color="primary"
          @click.prevent="resetPassword()"
          >Change Password</v-btn
        >
        <v-btn id="back" flat to="/">Back</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import zxcvbn from "zxcvbn";

import router from "@/router";
import feathersClient from "@/api/feathers-client";
import authClient from "@/api/auth-client";

export default {
  name: "Reset",
  props: {
    token: {
      type: String,
    },
  },
  data() {
    return {
      email: "",
      showCodeEnter: false,
      shortToken: "",
      hidePassword: true,
      showPasswordEntry: false,
      password: "",
      passwordStrength: 0,
      isLoading: false,
    };
  },
  methods: {
    ...mapActions("snackbar", { setSnackbar: "setText" }),
    ...mapActions("auth", ["authenticate", "logout"]),
    async requestReset() {
      const user = { email: this.email };
      this.isLoading = true;

      try {
        await authClient.sendResetPwd(user);
        this.showCodeEnter = true;
      } catch (e) {
        console.error(e);
        // one potential source of error is a not-verified user
        if (e.message.includes("User is not verified")) {
          this.setSnackbar(
            "Check your email to verify your email address before resetting your password."
          );
          authClient.resendVerifySignup(user);
        } else {
          this.setSnackbar("Something went wrong. Please try again.");
        }
      } finally {
        this.isLoading = false;
      }
    },
    setCode() {
      if (this.shortToken.length === 6) {
        this.showPasswordEntry = true;
      }
      // TODO: some unlikely error handling
    },
    checkPasswordStrength() {
      const result = zxcvbn(this.password);
      this.passwordStrength = result.score;
    },
    async resetPassword() {
      this.isLoading = true;
      try {
        let user;
        if (this.token) {
          user = await authClient.resetPwdLong(this.token, this.password);
        } else {
          user = await authClient.resetPwdShort(
            this.shortToken,
            { email: this.email },
            this.password
          );
        }
        this.showConfirm(user);
      } catch (e) {
        console.error(e);
        this.setSnackbar(e.message);
      } finally {
        this.isLoading = false;
      }
    },
    showConfirm(user) {
      this.setSnackbar("Password reset! 🙌");
      if (user && user.email && this.password) {
        this.authenticate({
          strategy: "local",
          email: user.email,
          password: this.password,
        })
          .then(() => {
            router.push("/home");
          })
          .catch((e) => console.error(e));
      }
    },
  },
  computed: {
    isDisabled: function () {
      // W3 Email regex: http://emailregex.com/
      const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      return !(this.email && regex.test(this.email));
    },
    color() {
      const colors = ["red", "orange", "amber", "light-green", "green"];
      return colors[this.passwordStrength];
    },
    progress() {
      if (this.passwordStrength === 0) {
        return 3;
      }
      return Math.min(100, this.passwordStrength * 25);
    },
  },
};
</script>
