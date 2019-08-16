<template>
  <div>
    <h4 class="text-primary mb-2">Report</h4>
    <h5 class="text-muted mb-5">{{ loading ? "Loading..." : report.date }}</h5>

    <base-input
      :disabled="report.completed"
      :required="true"
      label="Number of students"
      v-model="report.students"
    ></base-input>
    <v-select
      :disabled="report.completed"
      class="d-block mb-4"
      :options="topics"
      label="name"
      v-model="report.topics"
      multiple
      taggable
    ></v-select>
    <label for="">Comments</label>
    <textarea
      label="Comments"
      class="form-control"
      v-model="report.comment"
      :disabled="report.completed"
      rows="3"
    >
    </textarea>
    <base-button
      v-if="report.completed"
      type="success"
      class="float-right mt-5"
      @click="goToReports"
    >
      Back
    </base-button>
    <base-button
      v-else
      type="primary"
      class="float-right mt-5"
      @click="submitReport"
      >Submit</base-button
    >
  </div>
</template>
<script>
export default {
  data() {
    return {
      report_id: this.$route.params.id,
      report: { topics: [] },
      loading: true,
      errored: false,
      topics: []
    };
  },
  mounted() {
    this.loading = true;

    // get report
    this.axios
      .get(`/api/admin/reports/${this.report_id}`, {
        headers: { Authorization: window.$cookies.get("jwt") }
      })
      .then(response => {
        this.report = response.data;
      })
      .catch(error => {
        this.errored = true;
      })
      .finally(() => (this.loading = false));

    // get all available topics
    this.axios
      .get("/api/topics", {
        headers: { Authorization: window.$cookies.get("jwt") }
      })
      .then(response => {
        this.topics = response.data;
      });
  },
  methods: {
    submitReport() {
      this.axios
        .put(`/api/admin/reports/${this.report.id}`, {
          report: this.report
        })
        .then(response => {
          this.goToReports();
          this.$store.commit("ADD_ALERT", ["Report completed", "success"]);
        })
        .catch(error => {
          this.errored = true;
        });
    },
    goToReports() {
      this.$router.push({ path: "/admin-panel/reports/" });
    }
  }
};
</script>
