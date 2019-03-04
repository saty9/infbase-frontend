<template>
  <tr
    v-if="!deleted"
    class="row"
  >
    <td class="col">{{ hour.start }}</td>
    <td class="col">{{ hour.end }}</td>
    <td class="col text-right">
      <base-button
        outline
        type="info"
        class="btn-sm"
        @click="modal1 = true"
      >Edit</base-button>
      <base-button
        outline
        type="warning"
        class="btn-sm"
        @click="modal2 = true"
      >Remove</base-button>
    </td>
    <modal :show.sync="modal1">
      <h6
        slot="header"
        class="modal-title"
        id="modal-title-default"
      >Edit time slot</h6>
      <base-alert
        type="warning"
        v-if="errors"
      >
        {{errors}}
      </base-alert>
      <base-input
        class="mb-3"
        label="Start time"
      >
        <flat-picker
          slot-scope="{focus, blur}"
          @on-open="focus"
          @on-close="blur"
          :config="{enableTime: true, noCalendar: true, dateFormat: 'H:i', minTime: '08:00', maxTime: '20:00', time_24hr: true}"
          class="form-control datepicker"
          v-model="start"
        >
        </flat-picker>
      </base-input>
      <base-input
        class="mb-3"
        label="End time"
      >
        <flat-picker
          slot-scope="{focus, blur}"
          @on-open="focus"
          @on-close="blur"
          :config="{enableTime: true, noCalendar: true, dateFormat: 'H:i', minTime: '08:00', maxTime: '20:00', time_24hr: true}"
          class="form-control datepicker"
          v-model="end"
        >
        </flat-picker>
      </base-input>
      <template slot="footer">
        <base-button
          type="primary"
          @click="checkForm"
        >Save changes</base-button>
        <base-button
          type="link"
          class="ml-auto"
          @click="modal1 = false"
        >Close
        </base-button>
      </template>
    </modal>
    <modal
      :show.sync="modal2"
      gradient="danger"
      modal-classes="modal-danger modal-dialog-centered"
    >
      <h6
        slot="header"
        class="modal-title"
        id="modal-title-notification"
      >Your attention is required</h6>
      <div class="py-3 text-center">
        <i class="ni ni-bell-55 ni-3x"></i>
        <h4 class="heading mt-4">You should read this!</h4>
        <p>If you detele this time slot, something might break... (TODO)</p>
      </div>
      <template slot="footer">
        <base-button
          type="white"
          @click="deleteHour"
        >Delete anyway</base-button>
        <base-button
          type="link"
          text-color="white"
          class="ml-auto"
          @click="modal2 = false"
        >
          Close
        </base-button>
      </template>
    </modal>
  </tr>
</template>

<script>
import FlatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import Modal from "@/components/Modal";

export default {
  components: {
    Modal,
    FlatPicker
  },
  props: {
    hour: {
      type: Object,
      description: "Hour object (id, start, end)"
    }
  },
  data() {
    return {
      deleted: false,
      modal1: false,
      modal2: false,
      start: this.hour.start,
      end: this.hour.end,
      errors: "",
      end_edited: false
    };
  },
  methods: {
    checkForm() {
      this.errors = "";

      if (
        this.start &&
        this.end &&
        Number(this.start.replace(":", "")) < Number(this.end.replace(":", ""))
      ) {
        this.submitForm();
      }

      if (!this.start) this.errors = "Start time is missing.";
      if (!this.start) this.errors = "End time is missing.";
      if (
        Number(this.start.replace(":", "")) > Number(this.end.replace(":", ""))
      )
        this.errors = "End time should be after start time.";
    },
    submitForm() {
      this.axios
        .put(`/api/admin/hours/${this.hour.id}`, {
          hour: {
            start: this.start,
            end: this.end
          }
        })
        .then(response => {
          this.editSuccessful(response);
        })
        .catch(error => this.editFailed(error));
    },
    editSuccessful(response) {
      this.hour.start = this.start;
      this.hour.end = this.end;
      this.end_edited = false;
      this.modal1 = false;
    },
    editFailed(error) {
      this.errors = error;
    },
    deleteHour() {
      this.axios
        .delete(`/api/admin/hours/${this.hour.id}`)
        .then(response => {
          this.deleteSuccessful(response);
        })
        .catch(error => this.deleteFailed(error));
    },
    deleteSuccessful(response) {
      this.deleted = true;
      this.modal2 = false;
      document.body.classList.remove("modal-open"); // hack to forcefully close the modal
    },
    deleteFailed(error) {
      this.$store.commit("ADD_ALERT", ["Something went wrong.", "warning"]);
    }
  },
  watch: {
    start() {
      // Automatically set the end hour 1h after start hour on start change
      if (!this.end_edited) {
        let hour = this.start.split(":");
        hour[0] = Number(hour[0]) + 1;
        this.end = hour.join(":");
      }
    }
  }
};
</script>