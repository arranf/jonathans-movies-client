import Vue from "vue";
import Vuex from "vuex";

import feathersClient from "../api/feathers-client";
import feathersVuex from "feathers-vuex";

import usersOnlineGetters from "./users-online/getters";
import voteGetters from "./vote/getters";
import optionGetters from "./option/getters";
import pollGetters from "./poll/getters";

import time from "@/store/time";
import snackbar from "@/store/snackbar";
import collection from "@/store/collection";
import loading from "@/store/loading";

const { service, auth, FeathersVuex } = feathersVuex(feathersClient, {
  idField: "_id",
});
Vue.use(FeathersVuex);
Vue.use(Vuex);

let plugins = [
  service("poll", {
    getters: pollGetters,
    instanceDefaults: {
      options: "Option",
    },
  }),
  service("option", {
    getters: optionGetters,
    instanceDefaults: {
      film: "Film",
    },
  }),
  service("vote", { getters: voteGetters }),
  service("users"),
  service("films", {
    instanceDefaults: {
      get imdbLink() {
        return this.imdb_id ? `https://www.imdb.com/title/${this.imdb_id}` : "";
      },
    },
  }),
  service("users-online", { getters: usersOnlineGetters }),
  auth({ userService: "users" }),
];

const store = new Vuex.Store({
  modules: {
    time,
    snackbar,
    collection,
    loading,
  },
  plugins: [...plugins],
});

export default store;
