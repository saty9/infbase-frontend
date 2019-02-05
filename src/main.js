import Vue from 'vue/dist/vue.min.js'
import App from '../src/App.vue'
import VueRouter from 'vue-router'
import Vuex from "vuex";
import router from "../src/router";
import store from "../src/store"
import Argon from "../src/plugins/argon-kit";
import axios from 'axios';
import { securedAxiosInstance, plainAxiosInstance } from './backend/axios'
import VueAxios from 'vue-axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

Vue.config.productionTip = false
Vue.use(VueAxios, {
  secured: securedAxiosInstance,
  plain: plainAxiosInstance
})

new Vue({
  router,
  securedAxiosInstance,
  plainAxiosInstance,
  components: { App },
  template: '<App/>'
}).$mount("#app");

