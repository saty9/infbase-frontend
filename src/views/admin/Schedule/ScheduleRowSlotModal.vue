<template>
  <span>
    <session-update
      v-if="
        $store.state.userRole == 'admin' || $store.state.userRole == 'tutor'
      "
      @closeModal="closeModal"
      :session_prop="session_prop"
      :tutors="tutors"
      :day_prop="day_prop"
      :hour_prop="hour_prop"
      :modal="modal"
      @modified="modified"
    />
    <session-show
      v-else
      @closeModal="closeModal"
      :session_prop="session_prop"
      :tutors="tutors"
      :day_prop="day_prop"
      :hour_prop="hour_prop"
      :modal="modal"
    />
  </span>
</template>

<script>
import SessionUpdate from "./SessionUpdate";
import SessionShow from "./SessionShow";

export default {
  components: {
    SessionUpdate,
    SessionShow
  },
  props: {
    session_prop: {
      type: Object,
      default: () => {},
      description: "Session being changed/created"
    },
    tutors: {
      type: Array,
      default: () => [],
      description: "Array of all tutors"
    },
    day_prop: {
      type: Array,
      default: () => [],
      description: "Date of the session slot"
    },
    hour_prop: {
      type: Object,
      default: () => {},
      description: "Hour object of the session slot"
    },
    modal: {
      type: [Boolean, String],
      default: false,
      description: "Whether the modal is open"
    }
  },
  data() {
    return {
      errors: null,
      session: this.session_prop,
      tutor: null
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    modified(session, action) {
      this.$emit("modified", session, action);
      this.closeModal();
    }
  }
};
</script>
