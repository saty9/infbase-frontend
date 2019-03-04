<template>
  <base-button
    outline
    class="btn-sm"
    :type="
      session_prop.tutor_id == $store.state.userId ? 'warning' : 'secondary'
    "
    v-if="session_prop && (userRole == 'admin' || userRole == 'tutor')"
    @click="emitClick"
  >
    {{ session_prop.tutor_f_name }}
  </base-button>
  <span v-else-if="session_prop" class="course-button" @click="emitClick">
    <badge
      type="success"
      v-for="(course, idx) in session_prop.courses"
      :key="idx"
    >
      {{ course }}
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
    session_prop: {
      type: Object,
      default: null,
      description: "Object of the session at this slot"
    }
  },
  methods: {
    emitClick() {
      this.$emit("clicked", this.session_prop, this.day, this.hour);
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
.course-button { transition: all .1s ease-in-out; }
.course-button:hover {
  box-shadow: 0px 0px 10px -2px rgba(0, 0, 0, 0.75);
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>

