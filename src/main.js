import Vue from "vue/dist/vue.js";
import App from "./App.vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import router from "./router";
import store from "./store";
import Argon from "./plugins/argon-kit";
import axios from "axios";
import DisableAutocomplete from 'vue-disable-autocomplete';
import { securedAxiosInstance, plainAxiosInstance } from "./backend/axios";
import VueAxios from "vue-axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretLeft, faCaretRight, faFilter, faMinusCircle, faCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Vue2Filters from "vue2-filters";
import vSelect from "vue-select";
import JsonCSV from "vue-json-csv";

library.add({ faCaretLeft, faCaretRight, faFilter, faMinusCircle, faCheck, faSearch });

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(Argon);
Vue.use(VueAxios, axios);
Vue.use(require("vue-cookies"));
Vue.use(DisableAutocomplete);
Vue.use(Vue2Filters);
Vue.use(require("vue-moment"));
Vue.component("v-select", vSelect);
Vue.use(require("vue-moment"));
Vue.component("downloadCsv", JsonCSV);

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
  });
  store.$axios = v.axios;
  if (window.$cookies.get("userId") && window.$cookies.get("jwt")) {
    v.$store.dispatch("signedIn", [
      window.$cookies.get("jwt"),
      window.$cookies.get("userId"),
      window.$cookies.get("userRole")
    ]);
  }
  global.vm = v; //Define you app variable globally
  v.axios.interceptors.response.use(function (response) {
    // Do something before request is sent
    return response;
  }, function (error) {
    // Do something with request error
    if (error.response.status == 403) {
      v.$store.commit("ADD_ALERT", ["You are not authorised to perform this action", "warning"]);
    }
    return Promise.reject(error);
  });
  v.$mount("#app");
});