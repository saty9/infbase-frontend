<template>
  <section class="section section-shaped section-lg my-0 row justify-content-center">
    <div class="col-lg-10 row justify-content-center">
      <div
        class="nav flex-column nav-pills d-inline-block col-lg-2"
        id="v-pills-tab"
        role="tablist"
        aria-orientation="vertical"
      >
        <router-link
          to="/admin-panel/schedule"
          class="nav-link mb-1"
        >Schedule</router-link>
        <router-link
          to="/admin-panel/reports"
          class="nav-link mb-1"
        >Reports</router-link>
        <router-link
          to="/admin-panel/users"
          class="nav-link mb-1"
        >Users</router-link>
        <router-link
          v-if="userRole == 'admin'"
          to="/admin-panel/courses"
          class="nav-link mb-1"
        >Courses</router-link>
        <router-link
          v-if="userRole == 'admin'"
          to="/admin-panel/hours"
          class="nav-link mb-1"
        >Hours</router-link>
        <router-link
                v-if="userRole == 'tutor'"
                to="/admin-panel/questions"
                class="nav-link mb-1"
        >Questions</router-link>
        <router-link
                v-if="userRole == 'admin'"
                to="/admin-panel/question_summaries"
                class="nav-link mb-1"
        >Questions</router-link>
        <router-link
                to="/admin-panel/useful_resources"
                class="nav-link mb-1"
        >Useful Resources</router-link>
        <router-link
                to="/profile"
                class="nav-link mb-1"
        >My Profile</router-link>
      </div>
      <fade-transition
        mode="out-in"
        name="fade"
        :duration="300"
      >
        <card
          shadow
          class="tab-content col-lg-10 d-inline-block p-3 router-card"
        >
          <router-view></router-view>
        </card>
      </fade-transition>
    </div>
  </section>
</template>

<script>
import { FadeTransition } from "vue2-transitions";

export default {
  components: {
    FadeTransition
  },
  data() {
    return {};
  },
  computed: {
    userRole() {
      return this.$store.state.userRole;
    }
  }
};
</script>