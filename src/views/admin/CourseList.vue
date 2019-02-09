<template>
	<card shadow class="tab-content col-lg-10 d-inline-block">
		<h4 class="text-primary mb-5">Courses</h4>
		<section v-if="errored">
			<p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
		</section>
		<section v-else>
			<table class="table table-hover">
				<thead>
					<tr class="row">
						<th>
							Course
							<base-button type="success" class="d-inline-block btn-sm ml-2 align-top" @click="modal = true">
								+
							</base-button>
						</th>
						<th class="text-right col">Actions</th>
					</tr>
				</thead>
				<div v-if="loading">
					Loading...
				</div>
				<tbody v-else>
					<course-row v-for="course in courses" :course="course" :key="course.id"/>
				</tbody>
			</table>
		</section>
    <modal :show.sync="modal">
        <h6 slot="header" class="modal-title" id="modal-title-default">New course</h6>
        <div v-if="errors">
        	{{errors}}
        </div>
        <base-input
          required
          class="mb-3"
          placeholder="Course name"
          v-model="new_course_name"
        ></base-input>


        <template slot="footer">
            <base-button type="primary" @click="submitCourse">Create</base-button>
            <base-button type="link" class="ml-auto" @click="modal = false">Close
            </base-button>
        </template>
    </modal>
	</card>
</template>

<script>
	import CourseRow from "./CourseRow";
	import Modal from "@/components/Modal";

	export default {
		components: {
			CourseRow,
			Modal
		},
		data () {
			return {
				courses: null,
				loading: true,
				errored: false,
				errors: null,
				modal: false,
				new_course_name: "",
			}
		},
		mounted () {
	    this.getCourses();
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
			submitCourse () {
		    this.axios
		      .post('/api/courses', {
	          headers: { Authorization: window.$cookies.get("jwt") },
	          course: {
	          	name: this.new_course_name
	          }
	        })
		      .then(response => {
		      	this.getCourses();
		      	this.modal = false;
		      	this.$store.commit("ADD_ALERT", [`Course ${this.new_course_name} successfully created.`, "success"]);
		      })
		      .catch(error => {
		        this.errored = true;
		        this.errors = error;
		      })
			}
		}
	}
</script>

<style>
	
</style>