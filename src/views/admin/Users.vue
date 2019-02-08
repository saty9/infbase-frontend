<template>
	<div class="col-lg-10 users">
		<card class="tab-content w-100 d-inline-blockmb-3 mb-3" v-for="(user, idx) in users" :id="user">
			<h4 class="text-primary mb-5">{{user}}</h4>
			<section v-if="errored">
				<p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
			</section>
			<section v-else>
				<table class="table table-hover">
					<thead>
						<tr class="row">
							<th class="col">Name</th>
							<th class="col">Email</th>
							<th class="col text-right">Actions</th>
						</tr>	
					</thead>
					<div v-if="loading">
						Loading...
					</div>
				  <tbody v-else>
						<user-row v-if="user == 'Students'" v-for="student in page_users('student')" :user="student" :key="student.id"/>
						<user-row v-if="user == 'Tutors'" v-for="tutor in page_users('tutor')" :user="tutor" :key="tutor.id"/>
						<user-row v-if="user == 'Admins'" v-for="admin in page_users('admin')" :user="admin" :key="admin.id"/>
				  </tbody>
				</table>
				<base-pagination v-if="user == 'Students'" v-model="page_student" :total="students_count" align="center"></base-pagination>
				<base-pagination v-if="user == 'Tutors'" v-model="page_tutor" :total="tutors_count" align="center"></base-pagination>
				<base-pagination v-if="user == 'Admins'" v-model="page_admin" :total="admins_count" align="center"></base-pagination>
			</section>
		</card>	
	</div>
</template>

<script>
	import UserRow from "./User";
	import BasePagination from "@/components/BasePagination";

	export default {
		components: {
			UserRow,
			BasePagination
		},
		props: {
			users: {
				type: Array,
				default: () => ["Tutors", "Students"],
				description: "Which list to show opt(Students/Tutors/Admins)"
			}
		},
		data () {
			return {
				loading: true,
				all_users: null,
				errored: false,
				admins: null,
				tutors: null,
				students: null,
				page_student: 1,
				page_tutor: 1,
				page_admin: 1,
				per_page: 0
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
		        this.all_users = response.data;
		      })
		      .catch(error => {
		        this.errored = true;
		      })
		      .finally(() => this.loading = false)
			},
			page_users (role) {
				switch(role) {
					case "student":
						var users = this.students;
						var start = (this.page_student-1)*15;
						break;
					case "tutor":
						var users = this.tutors;
						var start = (this.page_tutor-1)*15;
						break;
					case "admin":
						var users = this.admins;
						var start = (this.page_admin-1)*15;
				}

				return users ? users.slice(start, start+15) : [];
			},
		},
		watch: {
			all_users () {
				this.tutors = this.all_users.filter(user => user.role == "tutor");
				this.students = this.all_users.filter(user => user.role == "student");
				this.admins = this.all_users.filter(user => user.role == "admin");
			}
		},
		computed: {
			students_count () {
				this.students ? this.students.length : 0;
			},
			tutors_count () {
				this.tutors ? this.tutors.length : 0;
			},
			admins_count () {
				this.admins ? this.admins.length : 0;
			}
		}
	}
</script>

<style scoped lang="scss">
	.users {
		padding: 0px;
	}
.table-row-move {
  transition: all .5s;
}

.table-row-item {
  backface-visibility: hidden;
}
</style>