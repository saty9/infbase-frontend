<template>
  <CourseUsefulResources v-bind:course_id="course_id"/>
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
      }
    },
  };
</script>
