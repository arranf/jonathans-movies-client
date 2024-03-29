import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import feathersClient from "@/api/feathers-client";
import { getOptionsForPoll, getCurrentPoll } from "@/api";

const Home = () => import("@/components/Home/HomeScreen");
const Login = () => import("@/components/Login/LoginScreen");
const SignUp = () => import("@/components/SignUp/SignUpScreen");
const Create = () => import("@/components/Create/CreateScreen");
const FilmList = () => import("@/components/Movies/FilmList");
const Add = () => import("@/components/Add/AddMovie");
const Discover = () => import("@/components/Discover/DiscoverScreen");
const Reset = () => import("@/components/Reset/PasswordResetScreen");
const Verify = () => import("@/components/Verify/VerifyScreen");
const Logout = () => import("@/components/Logout/LogoutScreen");
const SwitchCollection = () =>
  import("@/components/Collection/SwitchCollection");
const Privacy = () => import("@/components/Privacy/PrivacyScreen");
const NominateStreamingFilm = () =>
  import("@/components/StreamingFilm/NominateStreamingFilm");

Vue.use(Router);

const loginBeforeEnter = (_to, _from, next) => {
  if (store.state.auth.user) {
    next("/home");
  } else {
    store
      .dispatch("auth/authenticate")
      .then((payload) => {
        if (payload) {
          return feathersClient
            .service("users")
            .get(payload.userId)
            .then(() => initStore());
        } else {
          initStore();
        }
      })
      .then(() => {
        // TODO: Find a way to make sure people can login and get sent to where they're coming from
        next("/home");
      })
      .catch(function (error) {
        console.error(
          "Error authenticating in login router beforeEnter",
          error
        );
      });
  }
  next();
};

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: {
      doesNotNeedLogin: true,
      skipLoading: true,
    },
    beforeEnter: loginBeforeEnter,
  },
  {
    path: "/home/:filmId?",
    name: "Home",
    component: Home,
    props: true,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
    meta: {
      doesNotNeedLogin: true,
      skipLoading: true,
    },
  },
  {
    path: "/create",
    name: "Create",
    component: Create,
    meta: {
      admin: true,
      skipLoading: true,
    },
  },
  {
    path: "/movies/:filmId?",
    name: "Movies",
    component: FilmList,
    props: true,
  },
  {
    path: "/add",
    name: "Add",
    component: Add,
    meta: {
      admin: true,
    },
  },
  {
    path: "/discover/:filmId?",
    name: "Discover",
    component: Discover,
    props: true,
  },
  {
    path: "/reset/:token?",
    name: "Reset",
    component: Reset,
    meta: {
      doesNotNeedLogin: true,
      skipLoading: true,
    },
    props: true,
  },
  {
    path: "/verify/:token",
    name: "Verify",
    component: Verify,
    meta: {
      doesNotNeedLogin: true,
    },
    props: true,
  },
  {
    path: "/logout",
    name: "Logout",
    component: Logout,
    meta: {
      doesNotNeedLogin: true,
      skipLoading: true,
    },
  },
  {
    path: "/privacy",
    name: "Privacy Policy",
    component: Privacy,
    meta: {
      doesNotNeedLogin: true,
      skipLoading: true,
    },
  },
  {
    path: "/collection",
    name: "Collection",
    component: SwitchCollection,
    meta: {
      admin: true,
    },
  },
  {
    path: "/nominate-streaming-film/:justWatchId?",
    name: "Nominate Streaming Film",
    component: NominateStreamingFilm,
    props: true,
  },
];

const router = new Router({
  mode: "history",
  linkActiveClass: "active",
  routes,
});

function initStore() {
  if (!store.state.time.hasStarted) {
    store.dispatch("time/start");
    return getCurrentPoll()
      .then((response) => {
        if (response.total > 0) {
          const pollId = response.data[0]._id;
          return getOptionsForPoll(pollId);
        }
      })
      .catch((error) => console.error("Error initiating store", error));
  } else {
    return Promise.resolve();
  }
}

router.beforeEach((to, from, next) => {
  const user = store.state.auth.user;
  const requiresAuth = !to.matched.some(
    (record) => record.meta.doesNotNeedLogin
  );

  // Missing user and requires login
  if (!user && requiresAuth) {
    console.debug("Authenticating");
    store
      .dispatch("auth/authenticate")
      .then((payload) => {
        if (payload) {
          console.debug("Authenticated");
          feathersClient
            .service("users")
            .get(payload.userId)
            .then(() => initStore());
        } else {
          console.debug("Reauthenticated");
          initStore();
        }
      })
      .then(() => {
        directToNext(to, from, next, user);
      })
      .catch(function (error) {
        console.error(
          `Error authenticating before entering ${to.path}, directing to /`,
          error
        );
        next("/");
      });
  } else {
    directToNext(to, from, next, user);
  }
});

// Show loading animation
router.afterEach((to, from) => {
  if ((to.meta && to.meta.skipLoading) || from.name === to.name) {
    return;
  }
  store.dispatch("loading/setLoading", to.name);
});

function directToNext(to, from, next, user) {
  const allowed = !(
    to.matched.some((record) => record.meta.admin) &&
    (!user || !user.isAdmin)
  );
  initStore().then(() => {
    next(allowed);
  });
  // NO CATCH HERE: beforeEach handles catching
}

export default router;
