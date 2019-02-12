<template>
  <div id="app">
    <router-view name="header"></router-view>
    <main>
      <fade-transition
        origin="center"
        mode="out-in"
        :duration="250"
      >
        <router-view />
      </fade-transition>
    </main>
    <router-view name="footer"></router-view>
  </div>
</template>
<script>
import { FadeTransition } from "vue2-transitions";
import Header from "./layout/AppHeader";
import Footer from "./layout/AppFooter";

export default {
  components: {
    FadeTransition,
    Header,
    Footer
  }
};
</script>
