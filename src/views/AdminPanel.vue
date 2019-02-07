<template>
  <section class="section section-shaped section-lg my-0">
    <div class="shape bg-gradient-default">
    </div>
    <div class="container pt-lg-md col-lg-12">
      <div class="row justify-content-center">
					<tabs fill class="flex-column flex-md-row col-lg-12">
				    <card shadow>
			        <tab-pane>
		            <span slot="title">
	                <i class="ni ni-calendar-grid-58"/>
	                Schedule
		            </span>
								<courses/>
			        </tab-pane>

			        <tab-pane title="Profile">
		            <span slot="title">
	                <i class="ni ni-bell-55 mr-2"/>
	                Tutors
		            </span>
			          <tutors/>
			        </tab-pane>
				    </card>
					</tabs>
      </div>
    </div>
  </section>
</template>

<script>
	import Tabs from "@/components/Tabs/Tabs";
	import TabPane from "@/components/Tabs/TabPane";
	import Courses from "./admin/Courses";
	import Tutors from "./admin/Tutors";

	export default {
		components: {
			Tabs,
			TabPane,
			Courses,
			Tutors
		},
		data() {
			return {}
		}
	}
</script>

<style>
	
</style>