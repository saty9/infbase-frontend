import Vue from "vue/dist/vue.js";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    signedIn: false,
    userRole: "",
    alerts: []
  },
  actions: {
    signedIn(state, [token, userId, userRole]) {
      window.$cookies.set("jwt", token);
      window.$cookies.set("userId", userId);
      this.commit("signedIn", [token, userRole]);
    },
    signedOut(state) {
      let self = this;
      this.$axios.delete("/api/logout").then(function(response) {
        self.commit("signedOut");
      })
      .then(response => {
        self.commit("addAlert", "You logged out successfully.");
      })
      .catch(error => self.commit("addAlert", "Something went wrong."));
    }
  },
  mutations: {
    signedIn(state, [token, userRole]) {
      this.$axios.defaults.headers.common["Authorization"] = token;
      state.signedIn = true;
      state.userRole = userRole;
    },
    signedOut(state) {
      window.$cookies.remove("jwt");
      window.$cookies.remove("userId");
      this.$axios.defaults.headers.common["Authorization"] = null;
      state.signedIn = false;
      state.userRole = "";
    },
    addAlert(state, message) {
      let self = this;
      state.alerts.push(message);
      setTimeout(() => self.commit("removeAlert", message), 500 + message.length*70);
    },
    removeAlert(state, message) {
      state.alerts = state.alerts.filter(alert => alert != message);
    }
  }
});
