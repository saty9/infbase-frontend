<template>
	<div id="tutors">
		<h4>Tutors</h4>
		<section v-if="errored">
			<p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
		</section>
		<section v-else>
			<div v-if="loading">
				Loading...
			</div>
			<user v-else v-for="tutor in tutors" :user="tutor" :key="tutor.id"/>
		</section>
		<h4>Students</h4>
		<section v-if="errored">
			<p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
		</section>
		<section v-else>
			<div v-if="loading">
				Loading...
			</div>
			<user v-else v-for="student in students" :user="student" :key="student.id"/>
		</section>
	</div>
</template>

<script>
	import User from "./User";

	export default {
		components: {
			User
		},
		data () {
			return {
				loading: true,
				users: null,
				errored: false,
				tutors: null,
				students: null
			}
		},
		mounted () {
      this.getUsers();
		},
		methods: {
			getUsers () {
				this.loading = true;

		    this.axios
		      .get('/api/users/all', {
	          headers: { Authorization: window.$cookies.get("jwt") }
	        })
		      .then(response => {
		        this.users = response.data;
		      })
		      .catch(error => {
		        this.errored = true;
		      })
		      .finally(() => this.loading = false)
			}
		},
		watch: {
			users () {
				this.tutors = this.users.filter(user => user.role == "tutor");
				this.students = this.users.filter(user => user.role == "student");
			}
		}
	}
</script>

<style>
	
</style>