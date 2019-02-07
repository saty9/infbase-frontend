<template>
	<div id="courses">
		<h4 class="d-inline-block">Courses</h4>
		<base-button type="success" class="d-inline-block btn-sm ml-2 align-top" @click="modal = true">
			+
		</base-button>
		<section v-if="errored">
			<p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
		</section>
		<section v-else>
			<div v-if="loading">
				Loading...
			</div>
			<course v-else v-for="course in courses" :course="course" :key="course.id"/>
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
	</div>
</template>

<script>
	import Course from "./Course";
	import Modal from "@/components/Modal";

	export default {
		components: {
			Course,
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
		      	this.$store.commit("addAlert", `Course ${this.new_course_name} successfully created.`);
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