<template>
  <tr
    class="row"
    @click="$emit('clicked', report)"
  >
    <td class="col-2">
      <badge :type="completed ? 'success' : 'warning'">{{completed ? 'Completed' : 'Incomplete'}}</badge>
    </td>
    <td class="col-5">{{report.date}}</td>
    <td class="col-2">{{report.students}}</td>
    <td class="col-3">{{report.tutor_name}}</td>
  </tr>
</template>

<script>
export default {
  props: {
    report_prop: {
      type: Object,
      default: null,
      description: "Report object"
    }
  },
  data() {
    return {
      report: this.report_prop,
      completed: this.report_prop.completed
    };
  },
  watch: {
    report_prop() {
      this.report = this.report_prop;
      this.completed = this.report_prop.completed;
    }
  }
};
</script>

<style scoped>
tr:hover {
  cursor: pointer;
}
</style>

