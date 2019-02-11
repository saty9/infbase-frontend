<template>
	<div>
		<h4 class="text-primary mb-5 d-inline-block">Session hours</h4>
		<base-button @click="modal = true" class="float-right d-inline-block" type="primary">Add hour</base-button>

		<table class="table table-hover">
			<thead>
				<tr class="row">
					<th class="col">Start</th>
					<th class="col">End</th>
					<th class="col text-right pr-4">Actions</th>
				</tr>
			</thead>
			<p v-if="errored">We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
			<p v-else-if="loading">Loading...</p>
			<tbody v-else>
				<hour-row v-for="hour in sortedHours" :hour="hour" :key="hour.id"/>
			</tbody>
		</table>
    <modal :show.sync="modal">
        <h6 slot="header" class="modal-title" id="modal-title-default">New time</h6>
		    <base-alert type="warning" v-if="errors">
		        {{errors}}
		    </base-alert>
        <base-input class="mb-3" label="Start time">
					<flat-picker slot-scope="{focus, blur}"
						@on-open="focus"
						@on-close="blur"
						:config="{enableTime: true, noCalendar: true, dateFormat: 'H:i', minTime: '08:00', maxTime: '20:00', time_24hr: true}"
						class="form-control datepicker"
						v-model="start">
					</flat-picker>
        </base-input>
        <base-input class="mb-3" label="End time">
					<flat-picker slot-scope="{focus, blur}"
						@on-open="focus"
						@on-close="blur"
						:config="{enableTime: true, noCalendar: true, dateFormat: 'H:i', minTime: '08:00', maxTime: '20:00', time_24hr: true}"
						class="form-control datepicker"
						v-model="end">
					</flat-picker>
        </base-input>
        <template slot="footer">
            <base-button type="primary" @click="checkForm">Create</base-button>
            <base-button type="link" class="ml-auto" @click="modal = false">Close
            </base-button>
        </template>
    </modal>
	</div>
</template>

<script>
	import FlatPicker from "vue-flatpickr-component";
	import "flatpickr/dist/flatpickr.css";
	import HourRow from './SessionHourRow';
	import Modal from '@/components/Modal';

	export default {
		components: {
			HourRow,
			Modal,
			FlatPicker
		},
		props: {

		},
		data () {
			return {
				modal: false,
				loading: true,
				errored: false,
				errors: '',
				start: '10:00',
				end: '11:00',
				hours: [],
				end_edited: false
			}
		},
		mounted () {
	    this.loading = true;

	    this.axios
	      .get('/api/hours', {
	        headers: { Authorization: window.$cookies.get('jwt') }
	      })
	      .then(response => {
	        this.hours = response.data;
	      })
	      .catch(error => {
	        this.errored = true;
	      })
	      .finally(() => this.loading = false)
		},
		methods: {
			checkForm () {
				this.errors = '';

				if (this.start && this.end && 
						Number(this.start.replace(':', '')) < Number(this.end.replace(':', ''))) {
					this.submitForm();
				}

				if(!this.start) 
					this.errors = 'Start time is missing.';
				if(!this.start) 
					this.errors = 'End time is missing.';
				if(Number(this.start.replace(':', '')) > Number(this.end.replace(':', ''))) 
					this.errors = 'End time should be after start time.';
			},
			submitForm () {
        this.axios
          .post('/api/admin/hours', {
            hour: {
              start: this.start,
              end: this.end
            }
          })
          .then(response => {
            this.createSuccessful(response);
          })
          .catch(error => this.createFailed(error))
			},
			createSuccessful (response) {
				this.hours.push(response.data);
				this.end_edited = false;
				this.modal = false;
			},
			createFailed (error) {
				this.errors = error;
			}
		},
		computed: {
			sortedHours () {
				return this.hours.sort(function(a, b) { 
			    return Number(a.start.replace(':', '')) - Number(b.start.replace(':', ''));
				});
			}
		}
	}
</script>