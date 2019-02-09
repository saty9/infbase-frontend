<template>
	<card shadow class="tab-content col-lg-10 d-inline-block col-lg-10">
		<h4 class="text-primary mb-5">Schedule</h4>
		<session-schedule user="admin"/>
	</card>
</template>

<script>
	import SessionSchedule from "@/views/components/SessionSchedule";

	export default {
		components: {
			SessionSchedule
		},
		data () {
			return {

			}
		}
	}
</script>

<style>
	
</style>