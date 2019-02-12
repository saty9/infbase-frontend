<template>
  <modal
    :show.sync="modal_prop"
    class="text-left"
    @close="closeModal"
  >
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

    <vSelect
      v-if="tutors"
      v-model="tutor"
      label="first_name"
      :options="tutors"
    />

    <base-radio
      name="today"
      class="mt-3"
      v-model="occurrence"
    >
      Today only
    </base-radio>
    <base-radio
      name="weekly"
      class="mt-3"
      v-model="occurrence"
    >
      <div class="d-inline-block">Weekly on {{ dayOfWeek }} until</div>
      <flat-picker
        :config="{}"
        class="form-control datepicker"
        v-model="until"
      >
      </flat-picker>
    </base-radio>

    <template slot="footer">
      <base-button
        type="primary"
        @click="submitSession"
      >Save</base-button>
      <base-button
        type="link"
        class="ml-auto"
        @click="closeModal"
      >
        Close
      </base-button>
    </template>
  </modal>
</template>

<script>
import vSelect from "vue-select";
import Modal from "@/components/Modal";
import BaseRadio from "@/components/BaseRadio";
import FlatPicker from "vue-flatpickr-component";

export default {
  components: {
    vSelect,
    Modal,
    BaseRadio,
    FlatPicker
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
    modal_prop: {
      type: [Boolean, String],
      default: false,
      description: "Whether the modal is open"
    }
  },
  data() {
    return {
      errors: null,
      occurrence: "today",
      until: null,
      session: this.session_prop,
      tutor: null
    };
  },
  methods: {
    submitSession() {
      // new session
      if (!this.session)
        this.axios
          .post("/api/admin/teaching_sessions", {
            session: {
              tutor_id: this.tutor.id,
              hour_id: this.hour_prop.id,
              start_date: this.day_prop.join("-")
            },
            occurrence: this.occurrence,
            until: this.until
          })
          .then(response => {
            this.modifySuccessful(response.data, "created");
          })
          .catch(error => this.modifyFailed(error));
      //edit session
      else if (this.tutor)
        this.axios
          .put(`/api/admin/teaching_sessions/${this.session.id}`, {
            session: {
              tutor_id: this.tutor.id,
              hour_id: this.hour_prop.id,
              start_date: this.day_prop.join("-")
            },
            occurrence: this.occurrence,
            until: this.until
          })
          .then(response => {
            this.modifySuccessful(response.data, "updated");
          })
          .catch(error => this.modifyFailed(error));
      // destroy session
      else
        this.axios
          .delete(`/api/admin/teaching_sessions/${this.session.id}`, {
            params: {
              occurrence: this.occurrence,
              until: this.until
            }
          })
          .then(response => {
            this.modifySuccessful(null, "deleted");
          })
          .catch(error => this.modifyFailed());
    },
    modifySuccessful(response, action) {
      this.$store.commit("ADD_ALERT", [
        `Session slot ${action} successfully.`,
        "success"
      ]);
      this.$emit("modified", response, action);
      this.closeModal();
    },
    modifyFailed() {
      this.$store.commit("ADD_ALERT", ["Something went wrong.", "warning"]);
      this.closeModal();
    },
    closeModal() {
      this.$emit("closeModal");
    }
  },
  computed: {
    dayOfWeek() {
      if (this.day_prop)
        return new Date(...this.day_prop).toLocaleDateString("en-uk", {
          weekday: "long"
        });
    }
  },
  watch: {
    modal_prop() {
      if (this.modal_prop) {
        [this.session, this.tutor, this.occurrence] = [null, null, "today"];
        this.session = this.session_prop;
        this.tutor = this.tutors.find(
          tutor => tutor.id == this.session.tutor_id
        );
      }
    }
  }
};
</script>

<style scoped lang="scss">
.modal-body .dropdown {
  display: block;

  .dropdown-toggle::after {
    border: 0px !important;
  }
}
</style>


