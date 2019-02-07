<template>
	<div id="tutors">
		<h4 class="text-primary mb-5">Tutors</h4>
		<section v-if="errored">
			<p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
		</section>
		<section v-else>
			<div v-if="loading">
				Loading...
			</div>
			<table class="table table-hover">
				<thead>
					<tr class="row">
						<th class="col">Name</th>
						<th class="col">Email</th>
						<th class="col text-right">Actions</th>
					</tr>	
				</thead>
				<tbody>
					<user v-if="!loading" v-for="tutor in tutors" :user="tutor" :key="tutor.id"/>
				</tbody>
			</table>
		</section>
		<h4 class="text-primary my-5">Students</h4>
		<section v-if="errored">
			<p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
		</section>
		<section v-else>
			<div v-if="loading">
				Loading...
			</div>
			<table class="table table-hover">
				<thead>
					<tr class="row">
						<th class="col">Name</th>
						<th class="col">Email</th>
						<th class="col text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
					<user v-if="!loading" v-for="student in page_students" :user="student" :key="student.id"/>
				</tbody>
			</table>
			<base-pagination v-model="currentPage" :total="students.length" align="center"></base-pagination>
		</section>
	</div>
</template>

<script>
	import User from "./User";
	import BasePagination from "@/components/BasePagination";

	export default {
		components: {
			User,
			BasePagination
		},
		data () {
			return {
				loading: true,
				users: null,
				errored: false,
				tutors: null,
				students: null,
				currentPage: 1
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
		},
		computed: {
			page_students() {
				let start = (this.currentPage-1)*15;
				return this.students.slice(start, start+15);
			}
		}
	}
</script>

<style>
	
</style>