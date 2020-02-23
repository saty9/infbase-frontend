<template>
  <div>
    <h4 class="text-primary mb-5 d-inline-block"><span v-if="filter_id">Tutors </span>Schedule</h4>
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

    <div class="float-right d-inline-block">
      <label for="dataset-picker">Forecast Based on:</label>
      <input id="dataset-picker" type="button" class="btn btn-sm" @click="swap_forecast" :value="forecast_basis_display">
    </div>

    <section v-if="errored">
      <p>
        We're sorry, we're not able to retrieve this information at the moment,
        please try back later.
      </p>
    </section>
    <template v-else>
      <div id="legend" ref="legend"></div>
      <table class="table text-center" ref="table">
        <ScheduleHead :scope="calendar_scope" @range="changeRange" />
        <tbody>
          <ScheduleRow
            v-for="hour in hours"
            :key="hour.id"
            :sessions="sessions"
            :hour="hour"
            :range="calendar_range"
            :forecast_basis="forecast_basis"
            @clicked="sessionClicked"
          />
        </tbody>
      </table>
    </template>
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
import * as d3 from "d3";

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
    },
    filter_id: {
      type: Number,
      default: null
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
      hour: null,
      forecast_basis: "previous_session_attendance",
      forecast_basis_display: "Previous Attendance"
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

    this.showLegend();
    window.addEventListener('resize', this.showLegend)
  },
  beforeDestroy() {
    // Unregister the event listener before destroying this Vue instance
    window.removeEventListener('resize', this.showLegend)
  },
  methods: {
    getSessionsInRange(calendar_range) {
      let self = this;
      this.loading = true;

      this.axios
        .get("/api/teaching_sessions", {
          headers: { Authorization: window.$cookies.get("jwt") },
          params: { range: calendar_range }
        })
        .then(response => {
          if (self.filter_id) {
            self.sessions = response.data.filter(s => s.tutor_id == self.filter_id);
          } else {
            self.sessions = response.data;
          }
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
    },
    swap_forecast() {
      if (this.forecast_basis == 'interest') {
        this.forecast_basis = 'previous_session_attendance';
        this.forecast_basis_display = "Previous Attendance";
      } else {
        this.forecast_basis = 'interest';
        this.forecast_basis_display = "Students Interested";
      }
    },
    showLegend() {
      this.$refs.legend.innerHTML = "";
      var w = this.$refs.table.clientWidth, h = 50;
      var key = d3.select("#legend")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

      var legend = key.append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

      legend.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#00BF02")
        .attr("stop-opacity", 1);

      legend.append("stop")
        .attr("offset", "33%")
        .attr("stop-color", "#7BD003")
        .attr("stop-opacity", 1);

      legend.append("stop")
        .attr("offset", "66%")
        .attr("stop-color", "#E1B907")
        .attr("stop-opacity", 1);

      legend.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#F23F0B")
        .attr("stop-opacity", 1);

      key.append("rect")
        .attr("width", w)
        .attr("height", h - 30)
        .style("fill", "url(#gradient)")
        .attr("transform", "translate(0,10)");

      //var y = d3.scaleOrdinal(["busy", "quiet"])
      //  .range([3, 0]);
      var y = d3.scaleOrdinal([])
        .range([w-30, 30])
        .domain(["busy", "quiet"]);

      var yAxis = d3.axisBottom()
        .scale(y)
        .ticks(2);

      key.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0,30)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("axis title");
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
  table >>> th:not(:first-child):not(:last-child),
  table >>> tr td:not(:first-child):not(:last-child) {
    border-right: 0.225rem solid #dee2e6 !important;
  }
</style>