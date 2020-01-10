<template>
  <header class="header-global">
    <base-nav class="navbar-main" transparent type="" effect="light" expand>
      <a slot="brand" class="navbar-brand mr-lg-5" href="https://www.ed.ac.uk/" v-if="$route.meta.lightHeader">
        <img src="../assets/images/logo.png" />
      </a>
      <router-link slot="brand" to="/" class="navbar-brand mr-lg-5" v-else>
        <b>InfBase</b>
      </router-link>

      <div class="row" slot="content-header" slot-scope="{ closeMenu }">
        <div class="col-6 collapse-brand">
          <a href="https://www.ed.ac.uk/">
            <img src="../assets/images/logo.png" />
          </a>
        </div>
        <div class="col-6 collapse-close">
          <close-button @click="closeMenu"></close-button>
        </div>
      </div>

      <ul class="navbar-nav ml-lg-auto">
        <li class="nav-item">
          <router-link
            v-if="!signedIn"
            to="/login"
            class="btn btn-secondary"
            type="link"
          >
            Log in
          </router-link>
          <router-link
            v-if="signedIn && userRole == 'admin'"
            to="/admin-panel/schedule"
            class="btn"
            :class="
              $route.meta.lightHeader ? 'btn-primary' : 'btn-primary-link'
            "
          >
            Admin panel
          </router-link>
          <router-link
            v-if="signedIn && userRole == 'tutor'"
            to="/admin-panel/schedule"
            class="btn"
            :class="
              $route.meta.lightHeader ? 'btn-primary' : 'btn-primary-link'
            "
          >
            Tutor panel
          </router-link>
        </li>
        <base-dropdown tag="li" v-if="signedIn" class="ml-3">
          <base-button
            :outline="!$route.meta.lightHeader"
            slot="title"
            :type="$route.meta.lightHeader ? 'secondary' : 'primary'"
            class="dropdown-toggle"
          >
            Account
          </base-button>
          <router-link class="dropdown-item" to="/profile">
            Profile
          </router-link>
          <a class="dropdown-item" href="#" @click="logOut">Log out</a>
        </base-dropdown>
      </ul>
    </base-nav>
    <div id="alerts" v-if="anyAlerts" class="w-100 row">
      <base-alert
        v-for="[message, status] in $store.state.alerts"
        dismissible="true"
        :type="status"
        :message="message"
        :key="message"
        class="col-3 offset-8">
        {{ message }}
      </base-alert>
    </div>
    <br/>
  </header>
</template>
<script>
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";

export default {
  components: {
    BaseNav,
    CloseButton,
    BaseDropdown
  },
  methods: {
    logOut() {
      this.$store.dispatch("signedOut");
    }
  },
  computed: {
    signedIn() {
      return this.$store.state.signedIn;
    },
    userRole() {
      return this.$store.state.userRole;
    },
    anyAlerts() {
      return this.$store.state.alerts.length;
    }
  }
};
</script>
<style scoped lang="scss">
  #alerts {
    position: absolute;
    top: 95px;
    z-index: 1000;
  }
  .navbar-nav .nav-item {
    margin-right: 0px;
  }
  .navbar-transparent {
    background-color: #6b7bea;
  }
</style>
