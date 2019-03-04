<template>
  <tr class="row" v-if="anySessions || $store.state.userRole == 'admin'">
    <td class="col-1">{{ hour.start }}</td>
    <td class="col" v-for="day in range" :key="day[2]">
      <SessionSlot
        :hour="hour"
        :day="day"
        :session_prop="findSession(day.join('.'))"
        @clicked="emitClick"
      />
    </td>
    <td class="col-1"></td>
  </tr>
</template>

<script>
import SessionSlot from "./ScheduleRowSlot";

export default {
  components: {
    SessionSlot
  },
  props: {
    sessions: {
      type: Array,
      default: () => [],
      description: "Array of the sessions objects."
    },
    hour: {
      type: Object,
      default: () => {},
      description: "What time to show"
    },
    range: {
      type: Array,
      default: () => [],
      description: "Day range to show"
    }
  },
  methods: {
    findSession(day) {
      let hour_id = this.hour.id;

      return this.sessions.find(
        session => session.hour_id == hour_id && session.start_date == day
      );
    },
    emitClick(session_prop, day, hour) {
      this.$emit("clicked", session_prop, day, hour);
    }
  },
  computed: {
    anySessions() {
      let self = this;
      return this.range.reduce(function(answer, day) {
        return answer || self.findSession(day.join(".")) != undefined;
      }, false);
    }
  }
};
</script>

<style scoped>
table tbody tr:first-child td {
  margin-top: 10px;
}
</style>
