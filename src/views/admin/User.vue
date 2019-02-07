<template>
	<div class="user">
		{{user.email}}
	</div>
</template>

<script>
	export default {
		props: {
			user: {
				type: Object,
				default: null,
				description: "User model"
			}
		},
		data () {
			return {
				
			}
		}
	}
</script>

<style>
	
</style>