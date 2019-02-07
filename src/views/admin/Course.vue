<template>
	<div class="course d-inline-block pl-2" v-if="!deleted">
		<base-button type="secondary" @click="modal = true">{{course.name}}</base-button>
    <modal :show.sync="modal">
        <h6 slot="header" class="modal-title" id="modal-title-default">Edit course</h6>
        <div v-if="errors">
        	{{errors}}
        </div>
        <base-input
          required
          class="mb-3"
          placeholder="Course name"
          v-model="name"
        ></base-input>


        <template slot="footer">
            <base-button type="primary" @click="submit">Save changes</base-button>
            <base-button type="danger" @click="modal2 = true">Remove</base-button>
            <base-button type="link" class="ml-auto" @click="modal = false">Close
            </base-button>
        </template>
    </modal>
    <modal :show.sync="modal2"
           gradient="danger"
           modal-classes="modal-danger modal-dialog-centered">
        <h6 slot="header" class="modal-title" id="modal-title-notification">Your attention is required</h6>

        <div class="py-3 text-center">
            <i class="ni ni-bell-55 ni-3x"></i>
            <h4 class="heading mt-4">You should read this!</h4>
            <p>If you detele this course, some questions regarding this course might be deleted.</p>
        </div>

        <template slot="footer">
            <base-button type="white" @click="deleteCourse">Delete anyway</base-button>
            <base-button type="link"
                         text-color="white"
                         class="ml-auto"
                         @click="modal2 = false">
                Close
            </base-button>
        </template>
    </modal>
	</div>
</template>

<script>
	import Modal from "@/components/Modal";
	import BaseInput from "@/components/BaseInput";

	export default {
		components: {
			Modal
		},
		props: {
			course: {
				type: Object,
				default: null,
				description: "A course object",
			}
		},
		data() {
			return {
				modal: false,
				modal2: false,
				name: this.course.name,
				errors: '',
				deleted: false
			}
		},
		methods: {
			submit () {
        this.axios
          .put(`/api/courses/${this.course.id}`, {
            course: {
              name: this.name
            }
          })
          .then(response => {
            this.editSuccessful(response);
          })
          .catch(error => this.editFailed(error))
			},
			deleteCourse () {
        this.axios
          .delete(`/api/courses/${this.course.id}`)
          .then(response => {
            this.deleteSuccessful(response);
          })
          .catch(error => this.deleteFailed(error))
			},
			editSuccessful (response) {
				this.course.name = this.name;
				this.modal = false;
				this.$store.commit("addAlert", "Course successfully edited.");
			},
			editFailed (error) {

			},
			deleteSuccessful (response) {
				this.$store.commit("addAlert", `Course ${this.name} deleted.`);
				this.modal2 = false;
				this.modal = false;
				this.deleted = true;
			},
			deleteFailed (error) {
				this.$store.commit("addAlert", "Something went wrong.");
			}
		}
	}
</script>

<style>
	
</style>