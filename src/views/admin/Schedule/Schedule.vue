<template>
  <div>
    <h4 class="text-primary mb-5 d-inline-block">Schedule</h4>
    <base-dropdown class="float-right d-inline-block">
      <base-button
        outline
        slot="title"
        type="primary"
        class="dropdown-toggle btn-sm"
      >
        {{ calendar_scope }} days
      </base-button>
      <a
        class="dropdown-item"
        v-for="days in [3, 5, 7]"
        :key="days"
        @click="calendar_scope = days"
      >
        {{ days }} days
      </a>
    </base-dropdown>

    <section v-if="errored">
      <p>
        We're sorry, we're not able to retrieve this information at the moment,
        please try back later.
      </p>
    </section>
    <table class="table text-center" v-else>
      <ScheduleHead :scope="calendar_scope" @range="changeRange" />
      <tbody>
        <ScheduleRow
          v-for="hour in hours"
          :key="hour.id"
          :sessions="sessions"
          :hour="hour"
          :range="calendar_range"
          @clicked="sessionClicked"
        />
      </tbody>
    </table>
    <ScheduleModal
      :tutors="tutors"
      :session_prop="session"
      :day_prop="day"
      :hour_prop="hour"
      :modal="modal"
      @closeModal="closeModal"
      @modified="modifySessions"
    />
  </div>
</template>

<script>
import ScheduleRow from "./ScheduleRow";
import ScheduleHead from "@/views/components/Schedule/ScheduleHead";
import BaseDropdown from "@/components/BaseDropdown";
import ScheduleModal from "./ScheduleRowSlotModal";

export default {
  components: {
    ScheduleRow,
    ScheduleHead,
    BaseDropdown,
    ScheduleModal
  },
  props: {
    scope: {
      type: Number,
      default: 3,
      description: "How many days to show at once"
    },
    on_select: {
      type: Function,
      default: null,
      description: "Optional function to call when slot is selected"
    }
  },
  data() {
    return {
      modal: false,
      loading: true,
      errored: false,
      calendar_range: [],
      calendar_scope: this.scope,
      hours: [],
      sessions: [],
      tutors: [],
      session: null,
      day: null,
      hour: null
    };
  },
  mounted() {
    this.loading = true;

    // get tutors
    this.axios
      .get("/api/admin/users", {
        headers: { Authorization: window.$cookies.get("jwt") },
        params: { roles: ["tutor"] }
      })
      .then(response => {
        this.tutors = response.data;
      })
      .catch(error => {
        this.errored = true;
      });

    // get hours
    this.axios
      .get("/api/hours", {
        headers: { Authorization: window.$cookies.get("jwt") }
      })
      .then(response => {
        this.hours = response.data;
      })
      .catch(error => {
        this.errored = true;
      })
      .finally(() => (this.loading = false));
  },
  methods: {
    getSessionsInRange(calendar_range) {
      this.loading = true;

      this.axios
        .get("/api/teaching_sessions", {
          headers: { Authorization: window.$cookies.get("jwt") },
          params: { range: calendar_range }
        })
        .then(response => {
          this.sessions = response.data;
        })
        .catch(error => {
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    },
    changeRange(range, rails_range) {
      this.calendar_range = range;
      this.getSessionsInRange(rails_range);
    },
    modifySessions(session, action) {
      if (this.session) {
        let old_session_id = this.session.id;
        var idx = this.sessions.findIndex(sess => sess.id == old_session_id);
      }

      if (action == "created") this.sessions.push(session);
      else if (action == "updated") this.sessions.splice(idx, 1, session);
      else this.sessions.splice(idx, 1);
    },
    sessionClicked(session, day, hour) {
      if (this.on_select == null) {
        this.openModal(session, day, hour);
      } else {
        this.on_select(arguments);
      }
    },
    openModal(session, day, hour) {
      [this.session, this.day, this.hour] = [session, day, hour];
      this.modal = true;
    },
    closeModal() {
      this.modal = false;
    }
  }
};
</script>

<style scoped>
table >>> th,
table >>> tr td {
  padding: 0px;
  min-height: 50px;
  display: flex;
  justify-content: center; /* align horizontal */
  align-items: center; /* align vertical */
}
</style>