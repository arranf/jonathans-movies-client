import "@babel/polyfill";

import Vue from "vue";
import App from "@/components/skeleton/AppContainer";
import router from "./router";
import store from "./store/";
import "@/api/feathers-client";

import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

import "./plugins/vuetify";

// Import custom CSS
require("@/assets/styles/main.scss");

const isProduction = process.env.NODE_ENV === "production";
Vue.config.productionTip = !isProduction;
Vue.config.devtools = !isProduction;
Vue.config.performance = !isProduction;

if (isProduction) {
  Sentry.init({
    dsn: "https://af031047bfd341f8b9d082c5474c016d@sentry.io/1329415",
    integrations: [new Integrations.BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
