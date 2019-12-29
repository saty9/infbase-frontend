<template>
  <base-button
    outline
    class="btn-sm"
    :type="session.tutor_id == $store.state.userId ? 'warning' : 'secondary'"
    v-if="session && (userRole == 'admin' || userRole == 'tutor')"
    @click="emitClick"
  >
    {{ session.tutor_f_name }}
  </base-button>
  <span v-else-if="session" class="course-button d-inline-block p-1" @click="emitClick">
    <span v-if="session.courses.length">
      <badge type="success" v-for="(course, idx) in session.courses" :key="idx">
        {{ course }}
      </badge>
    </span>
    <badge v-else>
      NO COURSES SET
    </badge>
  </span>
  <base-button
    outline
    v-else-if="userRole == 'admin'"
    type="secondary"
    class="btn-sm"
    @click="emitClick"
    >+</base-button
  >
</template>

<script>
export default {
  props: {
    hour: {
      type: Object,
      default: () => {},
      description: "Start time of the slot"
    },
    day: {
      type: Array,
      default: () => [],
      description: "Date of the slot"
    },
    session: {
      type: Object,
      default: null,
      description: "Object of the session at this slot"
    }
  },
  methods: {
    emitClick() {
      this.$emit("clicked", this.session, this.day, this.hour);
    }
  },
  computed: {
    userRole() {
      return this.$store.state.userRole;
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-body .dropdown {
  display: block;

  .dropdown-toggle::after {
    border: 0px !important;
  }
}
.course-button {
  transition: all 0.1s ease-in-out;
}
.course-button:hover {
  box-shadow: 0px 0px 10px -2px rgba(0, 0, 0, 0.75);
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>

