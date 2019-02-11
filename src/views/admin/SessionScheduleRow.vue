<template>
	<tr class="row">
		<td class="col-1">{{ hour.start }}</td>
		<td class="col" v-for="day in range" :key="day.join('.')" >
			<SessionSlot :hour="hour" :day="day" :session_prop="findSession(day)" :tutors="tutors" />
		</td>
		<td class="col-1"></td>
	</tr>
</template>

<script>
	import SessionSlot from './SessionScheduleSlot';

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
			range: {
				type: Array,
				default: () => [],
				description: "Day range to show"
			},
			hour: {
				type: Object,
				default: () => {},
				description: "What time to show"
			},
			tutors: {
				type: Array,
				default: () => [],
				description: "Array of the available tutors"
			}
		},
		data () {
			return {

			}
		},
		methods: {
			findSession (slot_day) {
				let slot_start = this.hour.start;

				return this.sessions.find(session => 
					session.hour_id == this.hour.id && 
					session.start_date.replace(/\b0+/g, '') == slot_day.join('-')
				);
			}
		}
	}
</script>

<style scoped>
	table tbody tr:first-child td {
		margin-top: 10px;
	}
</style>
