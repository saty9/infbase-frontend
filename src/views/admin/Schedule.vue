<template>
	<card shadow class="tab-content col-lg-10 d-inline-block col-lg-10">
		<h4 class="text-primary mb-5">Schedule</h4>
		<schedule user="tutor"/>
	</card>
</template>

<script>
	import Schedule from "@/views/components/Schedule";

	export default {
		components: {
			Schedule
		},
		data () {
			return {

			}
		}
	}
</script>

<style>
	
</style>