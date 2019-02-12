<template>
  <div>
    <h4 class="text-primary mb-5">Reports</h4>

    <div v-if="errored">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </div>
    <table
      v-else
      class="table table-hover"
    >
      <thead>
        <tr class="row">
          <th class="col-2">Status</th>
          <th class="col-5">Date</th>
          <th class="col-2">Students</th>
          <th class="col-3">Tutor</th>
        </tr>
      </thead>
      <div
        v-if="loading"
        class="p-5"
      >
        <p>Loading...</p>
      </div>
      <tbody v-else>
        <ReportRow
          v-for="report in pageReports"
          :key="report.id"
          :report_prop="report"
          @clicked="openReport"
        />
      </tbody>
    </table>
    <base-pagination
      v-if="reports.length > 10"
      v-model="page"
      :total="reports.length"
      align="center"
    >
    </base-pagination>

  </div>
</template>

<script>
import ReportRow from "./ReportListRow";
import BasePagination from "@/components/BasePagination";

export default {
  components: {
    ReportRow,
    BasePagination
  },
  data() {
    return {
      reports: null,
      loading: false,
      errored: false,
      page: 1
    };
  },
  mounted() {
    this.loading = true;

    this.axios
      .get("/api/admin/reports", {
        headers: { Authorization: window.$cookies.get("jwt") }
      })
      .then(response => {
        this.reports = response.data;
      })
      .catch(error => {
        this.errored = true;
      })
      .finally(() => (this.loading = false));
  },
  methods: {
    openReport(report) {
      this.$router.push({ path: `/admin-panel/report/${report.id}` });
    }
  },
  computed: {
    pageReports() {
      var start = (this.page - 1) * 10;
      return this.reports ? this.reports.slice(start, start + 10) : [];
    }
  }
};
</script>