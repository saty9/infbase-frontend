<template>
	<div>
		<h4 class="text-primary mb-5 d-inline-block">Schedule</h4>
		<base-dropdown class="float-right d-inline-block">
			<base-button slot="title" type="secondary" class="dropdown-toggle">
				{{ calendar_scope }} days
			</base-button>
			<a class="dropdown-item" @click="calendar_scope = 3">3 days</a>
			<a class="dropdown-item" @click="calendar_scope = 5">5 days</a>
			<a class="dropdown-item" @click="calendar_scope = 7">7 days (slow loading)</a>
		</base-dropdown>
		<section v-if="errored">
			<p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
		</section>
		<table class="table text-center" v-else>
			<ScheduleHead :calendar_range="calendar_range" :scope="calendar_scope" @range="changeRange"/>
			<tbody v-if="loading">
				<h5 class="p-5">Loading...</h5>
			</tbody>
			<tbody v-else>
				<SessionRow v-for="hour in hours" 
										:key="hour.id"
										:sessions="sessions"
										:tutors="tutors" 
										:hour="hour" 
										:range="calendar_range"/>
			</tbody>
		</table>
	</div>
</template>

<script>
	import SessionRow from './ScheduleRow';
	import ScheduleHead from '@/views/components/Schedule/ScheduleHead';
	import BaseDropdown from '@/components/BaseDropdown';

	export default {
		components: {
			SessionRow,
			ScheduleHead,
			BaseDropdown
		},
		props: {
			scope: {
				type: Number,
				default: 3,
				description: "How many days to show at once"
			}
		},
		data () {
			return {
				loading: true,
				errored: false,
				calendar_start: null,
				calendar_range: [],
				calendar_scope: this.scope,
				hours: [],
				sessions: [],
				tutors: []
			}
		},
		mounted () {
			this.loading = true;

			// get tutors
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
		},
		methods: {
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
			},
			changeRange (range) {
				this.calendar_start = range[0];
				this.calendar_range = range;
				this.getSessionsInRange();
			}
		}
	}
</script>

<style scoped>
	table >>> th,
	table tr td {
	  padding: 0px;
		display: flex;
		justify-content: center; /* align horizontal */
		align-items: center; /* align vertical */
	}
</style>