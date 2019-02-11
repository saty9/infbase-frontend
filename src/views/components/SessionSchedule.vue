<template>
  <table class="table text-center border-0 schedule">
    <thead>
      <tr class="row">
        <th @click="previous_period()" class="col-1">
          <font-awesome-icon icon="caret-left" class="mb-2" size="2x" />
        </th>
        <th v-for="day in days" :key="day" class="col-2">
          <span
            class="btn btn-sm mb-3 align-top"
            :class="{ 'btn-primary': day.join() == get_today().join() }"
          >
            {{ formatted_date(day) }}
          </span>
        </th>
        <th @click="next_period()" class="col-1">
          <font-awesome-icon icon="caret-right" class="mb-2" size="2x" />
        </th>
      </tr>   
    </thead>
    <tbody v-if="!loading">
      <tr v-for="hour in existingHours" :key="hour" class="row">
        <td class="align-middle col-1">{{ hour }}</td>
        <td v-for="day in days" :key="day + hour" class="col-2">
          <session-slot
            :session="find_session(day, hour)"
            :user="user"
            :all_courses="courses"
          ></session-slot>
        </td>
        <td class="col-1"></td>
      </tr>      
    </tbody>
    <p v-else>Loading...</p>
  </table>
</template>

<script>
import SessionSlot from "./SessionSlot.vue";

  export default {
    components: {
      SessionSlot
    },
    props: {
      scope: {
        type: Number,
        default: 5,
        description: "How many days to show"
      },
      user: {
        type: String,
        default: "student",
        description: "Who will see the calendar (tutor/student/admin)"
      }
    },
    data() {
      return {
        loading: true,
        current_date: this.get_today(),
        courses: [],
        hours: [],
        days: this.get_n_days(this.get_today()),
        errored: false,
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
    mounted () {
      this.getCourses();
      this.getHours();
      this.getSessions();
    },
    methods: {
      getCourses () {
        this.loading = true;

        this.axios
          .get('/api/courses', {
            headers: { Authorization: window.$cookies.get("jwt") }
          })
          .then(response => {
            this.courses = response.data;
          })
          .catch(error => {
            this.errored = true;
          })
          .finally(() => this.loading = false)
      },
      getHours() {
        this.loading = true;

        this.axios
          .get('/api/hours', {
            headers: { Authorization: window.$cookies.get("jwt") }
          })
          .then(response => {
            this.hours = response.data;
          })
          .catch(error => {
            this.errored = true;
          })
          .finally(() => this.loading = false)
      },
      getSessions() {

      },
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
      find_session(day, hour) {
        let result = this.sessions.find(
          session => session.date.join() == day.join() && session.time == hour
        );
        return result ? result : {'date': day, 'time': hour};
      },
      orderedHours (hours) {
        return hours.sort(function(a, b) { 
          return Number(a.replace(':', '')) - Number(b.replace(':', ''));
        });
      }
    },
    watch: {
      current_date() {
        this.days = this.get_n_days(this.current_date);
      }
    },
    computed: {
      existingHours () {
        let days = this.days;
        let sessions = this.sessions;
        let result;
        if (this.user == 'admin') {
          result = this.hours;
        } else {
          result = this.hours.filter(
            hour =>
              sessions.filter(
                session =>
                  days.map(d => d.join()).includes(session.date.join()) &&
                  session.time == hour.start
              ).length
          );
        }
        return this.orderedHours(result);
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
  padding: 5px;
}
</style>
