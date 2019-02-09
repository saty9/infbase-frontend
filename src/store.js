import Vue from "vue/dist/vue.js";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    signedIn: false,
    userRole: "",
    alerts: []
  },
  mutations: {
    SIGNED_IN(state, [token, userRole]) {
      this.$axios.defaults.headers.common["Authorization"] = token;
      state.signedIn = true;
      state.userRole = userRole;
    },
    SIGNED_OUT(state) {
      window.$cookies.remove("jwt");
      window.$cookies.remove("userId");
      window.$cookies.remove("userRole");
      this.$axios.defaults.headers.common["Authorization"] = null;
      state.signedIn = false;
      state.userRole = "";
    },
    ADD_ALERT(state, [message, status]) {
      let self = this;
      state.alerts.push([message, status]);
      setTimeout(() => self.commit("REMOVE_ALERT", message), 700 + message.length*70);
    },
    REMOVE_ALERT(state, message) {
      state.alerts = state.alerts.filter(([msg, status]) => msg != message);
    }
  },
  actions: {
    signedIn(state, [token, userId, userRole]) {
      window.$cookies.set("jwt", token);
      window.$cookies.set("userId", userId);
      window.$cookies.set("userRole", userRole);
      this.commit("SIGNED_IN", [token, userRole]);
    },
    signedOut(state) {
      let self = this;
      this.$axios.delete("/api/logout").then(function(response) {
        self.commit("SIGNED_OUT");
      })
      .then(response => {
        self.commit("ADD_ALERT", ["You logged out successfully.", "success"]);
      })
      .catch(error => self.commit("ADD_ALERT", ["Something went wrong.", "warning"]));
    }
  }
});
