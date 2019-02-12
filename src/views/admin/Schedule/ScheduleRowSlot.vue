<template>
	<div>
		<SlotInner :session_prop="session" :tutor_prop="tutor" @clicked="modal = true"/>
    <modal :show.sync="modal" class="text-left">
        <h6 slot="header" class="modal-title" id="modal-title-default">Edit time slot</h6>
		    <base-alert type="warning" v-if="errors">
					{{errors}}
		    </base-alert>
				<v-select label="last_name" v-model="tutor" :options="tutors"></v-select>

		    <base-radio name="today" class="mt-3" v-model="occurrence">
	        Today only
		    </base-radio>
		    <base-radio name="weekly" class="mt-3" v-model="occurrence">
	        Weekly on {{ dayOfWeek }} until
		    </base-radio>

        <template slot="footer">
					<base-button type="primary" @click="submit">Save</base-button>
					<base-button type="link" class="ml-auto" @click="modal = false">
						Close
					</base-button>
        </template>
    </modal>
	</div>
</template>

<script>
	import SlotInner from "./ScheduleRowSlotInner";
	import Modal from '@/components/Modal';
	import vSelect from 'vue-select'

	export default {
		components: {
			SlotInner,
			Modal,
			vSelect
		},
		props: {
			day: {
				type: Array,
				default: () => [],
				description: "Date of the slot"
			},
			hour: {
				type: Object,
				default: () => {},
				description: "Start time of the slot"
			},
			tutors: {
				type: Array,
				default: () => [],
				description: "Array of the available tutors"
			},
			session_prop: {
				type: Object,
				default: null,
				description: "Object of the session at this slot"
			}
		},
		data () {
			return {
				session: null,
				modal: false,
				errors: '',
				tutor: null,
				occurrence: 'today',
				until: null
			}
		},
		mounted () {
			this.updateParams();
		},
		methods: {
			submit () {
				// new session
				if (!this.session_prop)
					this.axios
						.post('/api/admin/teaching_sessions', {
							session: {
								tutor_id: this.tutor.id,
								hour_id: this.hour.id,
								start_date: this.day.join('-')
							},
							occurrence: this.occurrence
						})
						.then(response => {
							this.createSuccessful(response);
						})
						.catch(error => this.createFailed(error))
					
				//edit session
				else if(this.tutor)
					this.axios
						.put(`/api/admin/teaching_sessions/${this.session.id}`, {
							session: {
								tutor_id: this.tutor.id,
								hour_id: this.hour.id,
								start_date: this.day.join('-')
							},
							occurrence: this.occurrence
						})
						.then(response => {
							this.createSuccessful(response);
						})
						.catch(error => this.createFailed(error))

				// destroy session
				else 
					this.axios
						.delete(`/api/admin/teaching_sessions/${this.session.id}`, {
							occurrence: this.occurrence
						})
						.then(response => {
							this.createSuccessful(response);
						})
						.catch(error => this.createFailed(error))
			},
			createSuccessful (response) {
				this.session = response;
				this.modal = false;
			},
			createFailed (error) {
				console.log(error);
			},
			updateParams () {
				if (this.session_prop) {
					let session = this.session_prop;
					this.session = this.session_prop;
					this.tutor = this.tutors.find(tutor => tutor.id == session.tutor_id);
				}
			}
		},
		computed: {
			dayOfWeek () {
				return new Date(...this.day).toLocaleDateString('en-uk', {'weekday': 'long'});
			}
		},
		watch: {
			session_prop () {
				this.updateParams();
			}
		}
	}
</script>

<style lang="scss">
	.modal-body .dropdown{
		display: block;

		.dropdown-toggle::after {
			border: 0px !important;
		}
	}
</style>

