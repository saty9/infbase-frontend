<template>
  <section>
    <label>
      Resources for:
      <select v-model="course_id">
        <option v-for="course in $store.state.courses" v-bind:value="course.id">
          {{course.name}}
        </option>
      </select>
    </label>
    <CourseUsefulResources v-bind:course_id="course_id" v-if="course_id"/>
      <div v-else>
        Please select a course
      </div>
  </section>
</template>
<script>
  import CourseUsefulResources from "../components/CourseUsefulResources";

  export default {
    name: "useful_resources_admin",
    components: {
      CourseUsefulResources
    },
    data: function () {
      return {
        course_id: null,
      }
    },
  };
</script>
