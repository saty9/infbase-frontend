<template>
  <div>
    <h4 class="text-primary mb-5 d-inline-block">My expertise</h4>
    <base-button
      @click="modal = true"
      class="float-right d-inline-block"
      type="primary"
    >Add expertise</base-button>
    <section v-if="errored">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </section>
    <section v-else>
      <table class="table table-hover">
        <thead>
          <tr class="row">
            <th> Expertise </th>
            <th class="text-right col pr-3"> Actions </th>
          </tr>
        </thead>
        <div v-if="loading">
          Loading...
        </div>
        <tbody v-else>
          <expertise-row
            v-for="expertise in expertises"
            :expertise="expertise"
            :key="expertise.id"
          />
        </tbody>
      </table>
    </section>
    <modal :show.sync="modal">
      <h6
        slot="header"
        class="modal-title"
        id="modal-title-default"
      >New expertise</h6>

      <v-select
        label="name"
        v-model="course"
        :options="courses"
      ></v-select>

      <template slot="footer">
        <base-button
          type="primary"
          @click="submit"
        >Create</base-button>
        <base-button
          type="link"
          class="ml-auto"
          @click="modal = false"
        >Close
        </base-button>
      </template>
    </modal>
  </div>
</template>

<script>
import ExpertiseRow from "./ExpertiseListRow";
import Modal from "@/components/Modal";
import vSelect from "vue-select";

export default {
  components: {
    ExpertiseRow,
    Modal,
    vSelect
  },
  data() {
    return {
      courses: null,
      course: null,
      expertises: null,
      loading: true,
      errored: false,
      modal: false
    };
  },
  mounted() {
    this.getCourses();
    this.getExpertises();
  },
  methods: {
    getCourses() {
      this.loading = true;

      this.axios
        .get("/api/courses", {
          headers: { Authorization: window.$cookies.get("jwt") }
        })
        .then(response => {
          this.courses = response.data;
        })
        .catch(error => {
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    },
    getExpertises() {
      this.loading = true;

      this.axios
        .get("/api/admin/expertises", {
          headers: { Authorization: window.$cookies.get("jwt") }
        })
        .then(response => {
          this.expertises = response.data;
        })
        .catch(error => {
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    },
    submit() {
      this.axios
        .post("/api/admin/expertises", {
          headers: { Authorization: window.$cookies.get("jwt") },
          expertise: {
            course_id: this.course.id,
            tutor_id: this.$store.state.userId
          }
        })
        .then(response => {
          this.expertises.push(response.data);
          this.modal = false;
          this.$store.commit("ADD_ALERT", ["Expertise added.", "success"]);
        })
        .catch(error => {
          this.errored = true;
        });
    }
  }
};
</script>

<style>
</style>