<template>
	<tr class="row">
		<td class="col">{{user.first_name}} {{user.last_name}}</td>
		<td class="col">{{user.email}}</td>
		<td class="col text-right">
			<base-button class="btn-sm" type="info" @click="modal = true">
				Edit
			</base-button>
		</td>
    <modal :show.sync="modal">
        <h6 slot="header" class="modal-title" id="modal-title-default">Edit user</h6>
        <div v-if="error">
        	{{error}}
        </div>
        <base-input
          class="mb-3"
          placeholder="First name"
          v-model="first_name"
        ></base-input>
        <base-input
          required
          class="mb-3"
          placeholder="Last name"
          v-model="last_name"
        ></base-input>

		    <base-radio name="student" class="mb-3" v-model="role">
	        Student
		    </base-radio>
		    <base-radio name="tutor" class="mb-3" v-model="role">
	        Tutor
		    </base-radio>

        <template slot="footer">
            <base-button type="primary" @click="saveUser">Save changes</base-button>
            <base-button type="link" class="ml-auto" @click="modal = false">Close
            </base-button>
        </template>
    </modal>
	</tr>
</template>

<script>
	import Modal from "@/components/Modal";

	export default {
		components: {
			Modal
		},
		props: {
			user: {
				type: Object,
				default: null,
				description: "User model"
			}
		},
		data () {
			return {
				modal: false,
				first_name: this.user.first_name,
				last_name: this.user.last_name,
				role: this.user.role,
				error: null
			}
		},
		methods: {
			saveUser() {
        this.axios
          .put(`/api/admin/users/${this.user.id}`, {
            user: {
              first_name: this.first_name,
              last_name: this.last_name,
              role: this.role
            }
          })
          .then(response => {
            this.editSuccessful(response);
          })
          .catch(error => this.editFailed(error))
			},
			editSuccessful (response) {
				this.user.first_name = this.first_name;
				this.user.last_name = this.last_name;
				this.user.role = this.role;
				this.modal = false;
				this.$store.commit("addAlert", "User successfully edited.");
				this.$emit('changed', this.user);
			},
			editFailed (error) {

			}
		}
	}
</script>

<style>
	
</style>