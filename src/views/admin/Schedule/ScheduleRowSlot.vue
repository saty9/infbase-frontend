<template>
  <base-button
    outline
    class="btn-sm"
    :type="session_prop.tutor_id == $store.state.userId ? 'warning' : 'secondary'"
    v-if="session_prop"
    @click="emitClick"
  >
    {{session_prop.tutor_f_name}}
  </base-button>
  <base-button
    v-else-if="userRole=='admin'"
    type="secondary"
    class="btn-sm"
    @click="emitClick"
  >+</base-button>
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

<style lang="scss">
.modal-body .dropdown {
  display: block;

  .dropdown-toggle::after {
    border: 0px !important;
  }
}
</style>

