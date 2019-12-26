<template>
  <div id="app">
    <router-view name="header"></router-view>
    <main>
      <fade-transition
        origin="center"
        mode="out-in"
        :duration="250"
      >
        <router-view v-if="login_checked"/>
        <section v-else class="section">
          <div class="container">
            <h1 class="text-center">Checking Login</h1>
            <div class="text-center">
            <font-awesome-icon :icon="['fas', 'spinner']" spin size="6x"/>
            </div>
          </div>
        </section>
      </fade-transition>
    </main>
    <router-view name="footer"></router-view>
  </div>
</template>
<script>
import { FadeTransition } from "vue2-transitions";
import Header from "./layout/AppHeader";
import Footer from "./layout/AppFooter";
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css'

export default {
  components: {
    FadeTransition,
    Header,
    Footer
  },
  data() {
    return {
      login_checked: false
    }
  },
  created() {
    let self = this;
    if (window.$cookies.get("userId") && window.$cookies.get("jwt")) {
      self.axios.get("/api/check_login", {headers: {Authorization:window.$cookies.get("jwt")}})
        .then(response => {
          self.$store.dispatch("signedIn", [
            window.$cookies.get("jwt"),
            response.data.id,
            response.data.role
          ]);
          self.login_checked = true;
        })
        .catch( error => {
          self.$store.dispatch("signedOut");
          self.login_checked = true;
        });
    } else {
      self.$store.dispatch("signedOut", [true]);
      self.login_checked = true;
    }
  }
};
</script>
