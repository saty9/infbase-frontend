<template>
  <modal :show.sync="modal" @close="closeModal">
    <h6 slot="header" class="modal-title" id="modal-title-default">
      Export reports
    </h6>

    <base-input class="mb-3" label="Start date">
      <flat-picker
        slot-scope="{ focus, blur }"
        @on-open="focus"
        @on-close="blur"
        class="form-control datepicker"
        v-model="start_date"
      >
      </flat-picker>
    </base-input>

    <base-input class="mb-3" label="End date">
      <flat-picker
        slot-scope="{ focus, blur }"
        @on-open="focus"
        @on-close="blur"
        class="form-control datepicker"
        v-model="end_date"
      >
      </flat-picker>
    </base-input>

    <template slot="footer">
      <base-button
        type="primary"
        @click="exportCsv"
        v-if="!generated && !errored"
        >Generate file</base-button
      >
      <download-csv
        class="btn btn-success"
        v-else-if="generated"
        :data="csv"
        :name="'reports-' + new Date()"
      >
        Download Data
      </download-csv>
      <base-button type="danger" v-else>File unavailable</base-button>
      <base-button type="link" class="ml-auto" @click="closeModal"
        >Close
      </base-button>
    </template>
  </modal>
</template>

<script>
import Modal from "@/components/Modal";
import FlatPicker from "vue-flatpickr-component";

export default {
  props: {
    modal: {
      type: [Boolean, String],
      default: false,
      description: "Is the modal opened?",
    }
  },
  components: {
    Modal,
    FlatPicker
  },
  data() {
    return {
      start_date: new Date(),
      end_date: new Date(),
      csv: null,
      fields: ["date", "tutor", "students", "topics", "comments"],
      generated: false,
      errored: false
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    exportCsv() {
      this.axios
        .get("/api/admin/reports/export_csv", {
          headers: { Authorization: window.$cookies.get("jwt") }
        })
        .then(response => {
          this.csv = response.data;
          this.generated = true;
        })
        .catch(() => {
          this.errored = true;
        });
    },
    resetDownload() {
      this.csv = null;
      this.generated = false;
    }
  },
  computed: {
    downloadUrl() {
      return this.csv.length > 0
        ? "data:text/csv," +
            encodeURIComponent(
              json2csv({ data: this.csv, fields: this.fields })
            )
        : "javascript:void(0);";
    }
  }
};
</script>
