<template>
	<div>
		<h4 class="text-primary mb-5">Schedule</h4>
		<section v-if="errored">
			<p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
		</section>
		<table class="table text-center" v-else>
			<thead>
				<tr class="row">
					<th class="col-1"><font-awesome-icon icon="caret-left" size="2x" @click="prevPeriod"/></th>
					<th class="col" v-for="date in calendar_range" 
													:key="date.join('.')" 
													:class="{'bg-warning': date.join('.') == today.join('.')}">
						{{ toFormattedDate(date) }}
					</th>
					<th class="col-1"><font-awesome-icon icon="caret-right" size="2x" @click="nextPeriod"/></th>
				</tr>
			</thead>
			<tbody v-if="loading">
				<h5 class="p-5">Loading...</h5>
			</tbody>
			<tbody v-else>
				<SessionRow v-for="hour in hours" 
										:key="hour"
										:sessions="sessions"
										:tutors="tutors" 
										:hour="hour" 
										:range="calendar_range"/>
			</tbody>
		</table>
	</div>
</template>

<script>
	import SessionRow from './SessionScheduleRow';

	export default {
		components: {
			SessionRow
		},
		data () {
			return {
				loading: true,
				errored: false,
				today: this.toArrayDate(new Date),
				calendar_start: null,
				calendar_range: [],
				calendar_scope: 3,
				hours: [],
				sessions: [],
				tutors: []
			}
		},
		mounted () {
			// get tutors
      this.loading = true;

			this.axios
				.get('/api/admin/users', {
					headers: { Authorization: window.$cookies.get("jwt") },
					params: {roles: ['tutor']}
				})
				.then(response => {
					this.tutors = response.data;
				})
				.catch(error => {
					this.errored = true;
				})
					
			// get hours
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

			// set calendar starting point
			this.calendar_start = this.toArrayDate(new Date());

			// set calendar scope
			let userRole = this.$store.state.userRole;
			if (userRole == 'admin' || userRole == 'tutor')
				this.calendar_scope = 5;
		},
		methods: {
			nextPeriod () {
        let d = this.calendar_start;
        this.calendar_start = [d[0], d[1], d[2] + this.calendar_scope];
			},
			prevPeriod () {
        let d = this.calendar_start;
        this.calendar_start = [d[0], d[1], d[2] - this.calendar_scope];
			},
			toArrayDate (date) {
        let year = date.getUTCFullYear();
        let month = date.getUTCMonth() + 1;
        let day = date.getUTCDate();

        return [year, month, day];
			},
			toFormattedDate (date) {
        date = new Date(Date.UTC(date[0], date[1] - 1, date[2]));

        return date.toLocaleDateString("en-UK", {
          weekday: "short",
          month: "short",
          day: "numeric"
        });
			},
			getSessionsInRange () {
	      this.loading = true;

	      this.axios
	        .get('/api/teaching_sessions', {
	          headers: { Authorization: window.$cookies.get("jwt") },
	          params: { range: this.calendar_range }
	        })
	        .then(response => {
	          this.sessions = response.data;
	        })
	        .catch(error => {
	          this.errored = true;
	        })
	        .finally(() => this.loading = false)
			}
		},
		watch: {
			calendar_start () {
				// Change the calendar range
				this.calendar_range = Array(this.calendar_scope)
          .fill(this.calendar_start)
          .map((x, idx) => [x[0], x[1], x[2] + idx]);

				// Get sessions in the new range
				this.getSessionsInRange();
			}
		}
	}
</script>

<style scoped>
	table tr th {
	  border: 0px;
	}

	table th,
	table tr td {
	  padding: 0px;
		display: flex;
		justify-content: center; /* align horizontal */
		align-items: center; /* align vertical */
	}

	.bg-warning {
		color: white;
		border-radius: 50px;
	}
</style>