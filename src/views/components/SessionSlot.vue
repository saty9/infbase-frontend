<template>
  <a v-if="courses && user == 'student'">
    <badge
      v-for="(course, idx) in all_courses"
      :key="idx"
      :type="courses.includes(course) ? 'success' : 'danger text-muted'"
    >
      {{ course }}
    </badge>
  </a>
  <base-button v-else-if="courses && user == 'tutor'" class="btn-sm" type="secondary">{{tutor.first_name}}</base-button>
  <base-button v-else-if="user == 'admin'" class="btn-sm" type="secondary">Assign</base-button>
</template>

<script>
export default {
  props: {
    session: {
      type: Object,
      default: "",
      description: "Arrays of the session in this slot"
    },
    user: {
      type: String,
      default: "student",
      description: "Which type of user is this intended for? (student/tutor/admin)"
    },
    all_courses: {
      type: Array,
      default: () => [],
      description: "All available courses"
    }
  },
  data() {
    return {
      date: this.session.date,
      time: this.session.time,
      tutor: this.session.tutor,
      courses: this.session.tutor.courses
    };
  }
};
</script>

<style></style>
