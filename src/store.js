import Vue from "vue/dist/vue.js";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    signedIn: false,
    userRole: "",
    id: "",
    alerts: [],
    tags: [],
    courses: [],
  },
  mutations: {
    SIGNED_IN(state, [token, userId, userRole]) {
      this.$axios.defaults.headers.common["Authorization"] = token;
      state.signedIn = true;
      state.userRole = userRole;
      state.userId = userId;
    },
    SIGNED_OUT(state) {
      window.$cookies.remove("jwt");
      window.$cookies.remove("userId");
      window.$cookies.remove("userRole");
      state.signedIn = false;
      state.userId = "";
      state.userRole = "";
      this.$axios.defaults.headers.common["Authorization"] = null;
    },
    ADD_ALERT(state, [message, status]) {
      let self = this;
      state.alerts.push([message, status]);
      setTimeout(
        () => self.commit("REMOVE_ALERT", message),
        700 + message.length * 70
      );
    },
    REMOVE_ALERT(state, message) {
      state.alerts = state.alerts.filter(([msg, _status]) => msg != message);
    },
    UPDATE_AVAILABLE_TAGS(state, tags){
      state.tags = tags;
    },
    UPDATE_AVAILABLE_COURSES(state, courses){
      state.courses = courses;
    },
  },
  actions: {
    signedIn(_state, [token, userId, userRole]) {
      window.$cookies.set("jwt", token);
      window.$cookies.set("userId", userId);
      window.$cookies.set("userRole", userRole);
      this.commit("SIGNED_IN", [token, userId, userRole]);
    },
    signedOut(_state) {
      let self = this;
      self.commit("SIGNED_OUT");
      this.$axios
        .delete("/api/logout")
        .then(_response => {
          self.commit("ADD_ALERT", ["You logged out successfully.", "success"]);
        })
        .catch(_error =>
          self.commit("ADD_ALERT", ["Something went wrong.", "warning"])
        );
    },
    updateAvailableTagsAndCourses(_state){
      let self = this;
      this.$axios.get("/api/courses").then(function (response) {
        self.commit("UPDATE_AVAILABLE_COURSES",response.data);
      });
      this.$axios.get("/api/topics").then(function (response) {
        self.commit("UPDATE_AVAILABLE_TAGS",response.data);
      });
    },
  }
});