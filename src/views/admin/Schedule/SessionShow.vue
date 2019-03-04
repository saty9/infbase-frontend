<template>
  <modal
    :show.sync="modal"
    class="text-left"
    @close="closeModal"
    modalClasses="wide"
  >
    <h6 slot="header" class="modal-title" id="modal-title-default">
      Session
    </h6>

    <div class="row">
      <tutor-info :tutor="tutor" />
      <div class="col text-center" v-if="session_prop">
        <h3>{{ hour_prop.start }} - {{ hour_prop.end }}</h3>
        <h4 class="text-muted">
          {{ toFormattedDate(session_prop.start_date.split(".")) }}
        </h4>
        <h4 class="text-muted">
          7.03 Appleton Tower
        </h4>
        <base-button type="primary w-100 my-3" @click="closeModal">
          Ask in advance
        </base-button>
        <base-button
          type="secondary w-100"
          @click="submitInterested"
          :disabled="isInterested"
        >
          Interested/Going
        </base-button>
      </div>
    </div>

    <template slot="footer" class="text-center">
      <base-button type="link" class="ml-auto" @click="closeModal">
        Close
      </base-button>
    </template>
  </modal>
</template>

<script>
import Modal from "@/components/Modal";
import TutorInfo from "@/views/components/TutorInfo";

export default {
  components: {
    Modal,
    TutorInfo
  },
  props: {
    session_prop: {
      type: Object,
      default: () => {},
      description: "Session opened"
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
    interests: {
      type: Array,
      default: () => [],
      description: "Array of student interests"
    },
    modal: {
      type: [String, Boolean],
      default: false,
      description: "Whether the modal is opened"
    }
  },
  data() {
    return {
      errors: null,
      session: this.session_prop,
      tutor: null
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    toFormattedDate(date, format) {
      date = new Date(Date.UTC(date[0], date[1] - 1, date[2]));
      let options = {
        weekday: "short",
        month: "short",
        day: "numeric"
      };

      if (format == "rails") options["year"] = "numeric";

      return date.toLocaleDateString("en-UK", options);
    },
    submitInterested() {
      this.axios
        .post("/api/interests", {
          headers: { Authorization: window.$cookies.get("jwt") },
          interest: { teaching_session_id: this.session_prop.id }
        })
        .then(response => {
          this.interests = response.data;
          this.$store.commit("ADD_ALERT", [
            "You showed interest in a session",
            "success"
          ]);
        });
    }
  },
  computed: {
    dayOfWeek() {
      if (this.day_prop)
        return new Date(...this.day_prop).toLocaleDateString("en-uk", {
          weekday: "long"
        });
      else return false;
    },
    isInterested() {
      let session_id = this.session_prop.id;
      return this.interests.find(
        interest => interest.teaching_session_id == session_id
      );
    }
  },
  watch: {
    session_prop() {
      let tutor_id = this.session_prop.tutor_id;
      this.tutor = this.tutors.find(tutor => tutor.id == tutor_id);
    }
  }
};
</script>
