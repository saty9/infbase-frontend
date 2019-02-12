<template>
  <tr v-if="!deleted" class="row">
    <td class="col">{{course.name}}</td>
    <td class="text-right col">
      <base-button type="info" class="btn-sm" @click="modal1 = true">Edit</base-button>
      <base-button type="warning" class="btn-sm" @click="modal2 = true">Remove</base-button>
    </td>
    <modal :show.sync="modal1">
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
            <base-button type="link" class="ml-auto" @click="modal1 = false">Close
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
  </tr>
</template>

<script>
	import Modal from "@/components/Modal";
	import BaseInput from "@/components/BaseInput";

	export default {
		components: {
			Modal,
      BaseInput
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
				modal1: false,
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
				this.$store.commit("ADD_ALERT", ["Course successfully edited.", "success"]);
			},
			editFailed (error) {

			},
			deleteSuccessful (response) {
				this.$store.commit("ADD_ALERT", [`Course ${this.name} deleted.`, "success"]);
				this.modal2 = false;
				this.modal = false;
				this.deleted = true;
			},
			deleteFailed (error) {
				this.$store.commit("ADD_ALERT", ["Something went wrong.", "warning"]);
			}
		}
	}
</script>

<style>
	
</style>