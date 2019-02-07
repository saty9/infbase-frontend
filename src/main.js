import Vue from "vue/dist/vue.js";
import App from "./App.vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import router from "./router";
import store from "./store";
import Argon from "./plugins/argon-kit";
import axios from "axios";
import { securedAxiosInstance, plainAxiosInstance } from "./backend/axios";
import VueAxios from "vue-axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add({ faCaretLeft, faCaretRight });

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(Argon);
Vue.use(VueAxios, axios);
Vue.use(require("vue-cookies"));

Vue.config.productionTip = false;
Vue.use(VueAxios, {
  secured: securedAxiosInstance,
  plain: plainAxiosInstance
});

document.addEventListener("DOMContentLoaded", () => {
  let v = new Vue({
    store,
    router,
    securedAxiosInstance,
    plainAxiosInstance,
    components: { App },
    template: "<App/>"
  }).$mount("#app");
  store.$axios = v.axios;
  if (window.$cookies.get("userId") && window.$cookies.get("jwt")) {
    v.$store.dispatch("signedIn", [
      window.$cookies.get("jwt"),
      window.$cookies.get("userId")
    ]);
  }
});
