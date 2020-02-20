<template>
  <div>
    <Schedule></Schedule>
    <div v-if="$store.state.userRole=='admin'">
      <h5 class="text-primary mb-5 d-inline-block">Reported busyness</h5>
      <br>
      <BusynessDisplay/>
    </div>
  </div>
</template>

<script>
  import Schedule from "./Schedule";
  import BusynessDisplay from "./BusynessDisplay";

  export default {
    name: "AdminSchedule",
    components: {Schedule, BusynessDisplay}
  }
</script>

<style scoped>

</style>