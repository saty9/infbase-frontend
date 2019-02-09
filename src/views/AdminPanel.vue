<template>
  <section class="section section-shaped section-lg my-0 row justify-content-center">
    <div class="shape bg-gradient-default">
    </div>
    <div class="col-lg-10 row justify-content-center">
			<div class="nav flex-column nav-pills d-inline-block col-lg-2" id="v-pills-tab" role="tablist" aria-orientation="vertical">
			  <router-link to="/admin-panel/schedule" class="nav-link mb-1">Schedule</router-link>
			  <router-link to="/admin-panel/reports" class="nav-link mb-1">Reports</router-link>
			  <router-link to="/admin-panel/users" class="nav-link mb-1">Users</router-link>
			  <router-link to="/admin-panel/courses" class="nav-link mb-1">Courses</router-link>
			</div>
    	<router-view></router-view>
    </div>
  </section>
</template>

<script>
	export default {
		data() {
			return {}
		}
	}
</script>

<style>
	
</style>