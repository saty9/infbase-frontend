<template>
  <modal
    :show.sync="modal"
    class="text-left"
    @close="closeModal"
    modalClasses="wide"
  >
    <div class="row">
      <tutor-info :tutor="tutor" />
      <div class="col">
      {{session_prop.forecast_busyness["previous_session_attendance"]}} students attended last week expected, {{session_prop.forecast_busyness["interest"]}} planning to attend
      </div>
      <div class="col text-right pr-4" v-if="session_prop">
        <h3>{{ hour_prop.start }} - {{ hour_prop.end }}</h3>
        <h4 class="text-muted">
          {{ toFormattedDate(session_prop.start_date.split(".")) }}
        </h4>
        <h4 class="text-muted">
          7.03 Appleton Tower
        </h4>
      </div>
    </div>

    <template slot="footer" class="text-center">
      <base-button outline type="primary" class="" @click="askQ">
        Ask in advance
      </base-button>
      <base-button
        outline
        type="default"
        @click="submitInterested"
        :disabled="isInterested"
      >
        {{ isInterested ? `${interests.length} student(s) going` : "Going" }}
      </base-button>
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
      type: Date,
      default: () => [],
      description: "Date of the session slot"
    },
    hour_prop: {
      type: Object,
      default: () => {},
      description: "Hour object of the session slot"
    },
    modal: {
      type: [String, Boolean],
      default: false,
      description: "Whether the modal is opened"
    }
  },
  data() {
    let tutor_id = this.session_prop.tutor_id;
    let tutor = this.tutors.find(tutor => tutor.id == tutor_id);
    return {
      errors: null,
      session: this.session_prop,
      tutor: tutor,
      interests: []
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
      this.interests = [];
    },
    askQ() {
      this.$router.push({name:"faq_ask", params: { session_id: this.session_prop.id }})
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
        return this.day_prop.toLocaleDateString("en-uk", {
          weekday: "long"
        });
      else return false;
    },
    isInterested() {
      let user_id = this.$store.state.userId;
      return this.interests.find(interest => interest.user_id == user_id);
    }
  },
  watch: {
    session_prop() {
      let tutor_id = this.session_prop.tutor_id;
      this.tutor = this.tutors.find(tutor => tutor.id == tutor_id);

      // get session interests
      this.axios
        .get("/api/interests", {
          headers: { Authorization: window.$cookies.get("jwt") },
          params: { session_id: this.session_prop.id }
        })
        .then(response => {
          this.interests = response.data;
        });
    }
  }
};
</script>
