<template>
  <CourseUsefulResources
          v-bind:course_id="course_id"
          v-bind:topic_id="topic_id"
  />
</template>
<script>
  import CourseUsefulResources from "./components/CourseUsefulResources";

  export default {
    name: "useful_resources",
    components: {
      CourseUsefulResources
    },
    data: function () {
      return {
        course_id: this.$route.params['course_id'],
        topic_id: this.$route.params['topic_id'],
      }
    },
  };
</script>
