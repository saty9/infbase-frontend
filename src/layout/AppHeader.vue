<template>
  <header class="header-global">
    <base-nav class="navbar-main" transparent type="" effect="light" expand>
      <a slot="brand" class="navbar-brand mr-lg-5" href="https://www.ed.ac.uk/">
        <img src="../assets/images/logo.png" />
      </a>

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

      <ul class="navbar-nav align-items-lg-center ml-lg-auto">
        <li class="nav-item d-none d-lg-block ml-lg-4">
          <router-link
            v-if="!signedIn"
            to="/login"
            class="btn btn-neutral btn-icon"
          >
            <span class="btn-inner--icon">
              <i class="fa fa-sign-in mr-2"></i>
            </span>
            <span class="nav-link-inner--text">Log in</span>
          </router-link>
          <base-button
            v-if="signedIn"
            @click="logout"
            class="btn btn-neutral btn-icon"
          >
            <span class="btn-inner--icon">
              <i class="fa fa-sign-in mr-2"></i>
            </span>
            <span class="nav-link-inner--text">Log out</span>
          </base-button>
        </li>
      </ul>
    </base-nav>
  </header>
</template>
<script>
import BaseNav from "@/components/BaseNav";
import CloseButton from "@/components/CloseButton";

export default {
  components: {
    BaseNav,
    CloseButton
  },
  methods: {
    logout() {
      this.$store.dispatch("signedOut");
    }
  },
  computed: {
    signedIn() {
      return this.$store.state.signedIn;
    }
  }
};
</script>
<style></style>
