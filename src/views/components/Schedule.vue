<template>
    <table class="table text-center border-0 schedule">
      <thead>
        <tr>
          <th @click="previous_period()">
            <font-awesome-icon icon="caret-left" class="mb-2" size="2x" />
          </th>
          <th v-for="day in days" :key="day">
            <span
              class="btn btn-sm mb-3 align-top"
              :class="{ 'btn-primary': day.join() == get_today().join() }"
            >
              {{ formatted_date(day) }}
            </span>
          </th>
          <th @click="next_period()">
            <font-awesome-icon icon="caret-right" class="mb-2" size="2x" />
          </th>
        </tr>   
      </thead>
      <tbody>
        <tr v-for="hour in existing_hours(hours)" :key="hour">
          <td class="align-middle">{{ hour }}</td>
          <td v-for="day in days" :key="day + hour">
            <time-slot
              v-if="find_session(day, hour)"
              :session="find_session(day, hour)"
            ></time-slot>
          </td>
          <td></td>
        </tr>      
      </tbody>
    </table>
</template>

<script>
import TimeSlot from "./Slot.vue";

export default {
  components: {
    TimeSlot
  },
  props: {
    scope: {
      type: Number,
      default: 3,
      description: "How many days to show"
    },
    user: {
      type: String,
      default: "student",
      description: "Who will see the calendar (tutor/student)"
    }
  },
  data() {
    return {
      current_date: this.get_today(),
      days: this.get_n_days(this.get_today()),
      hours: [
        "10:00",
        "11:10",
        "12:10",
        "13:10",
        "14:10",
        "15:10",
        "16:10",
        "17:10"
      ],
      sessions: [
        {
          date: [2019, 2, 4],
          time: "10:00",
          tutor: {
            name: "Ivan",
            experience: "4 years",
            courses: ["Inf2B", "Inf2D"]
          }
        }
      ]
    };
  },
  methods: {
    get_today() {
      let today = new Date();
      let year = today.getUTCFullYear();
      let month = today.getUTCMonth() + 1;
      let day = today.getUTCDate();

      return [year, month, day];
    },
    get_n_days(first_day) {
      return Array(this.scope)
        .fill(first_day)
        .map((x, idx) => [x[0], x[1], x[2] + idx]);
    },
    next_period() {
      let d = this.current_date;
      this.current_date = [d[0], d[1], d[2] + this.scope];
    },
    previous_period() {
      let d = this.current_date;
      this.current_date = [d[0], d[1], d[2] - this.scope];
    },
    formatted_date(date) {
      date = new Date(Date.UTC(date[0], date[1] - 1, date[2]));
      return date.toLocaleDateString("en-UK", {
        weekday: "short",
        month: "short",
        day: "numeric"
      });
    },
    existing_hours(hours) {
      let days = this.days;
      let sessions = this.sessions;

      return hours.filter(
        hour =>
          sessions.filter(
            session =>
              days.map(d => d.join()).includes(session.date.join()) &&
              session.time == hour
          ).length
      );
    },
    find_session(day, hour) {
      return this.sessions.find(
        session => session.date.join() == day.join() && session.time == hour
      );
    }
  },
  watch: {
    current_date() {
      this.days = this.get_n_days(this.current_date);
    }
  }
};
</script>

<style scoped>
.schedule tr th {
  border-top: 0px;
}

.schedule th,
.schedule tr td {
  padding: 0px;
}
</style>
