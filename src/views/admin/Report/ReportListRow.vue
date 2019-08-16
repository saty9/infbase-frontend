<template>
  <tr class="row">
    <td class="col-2">
      <badge :type="completed ? 'success' : 'warning'">{{
        completed ? "Submitted" : "Incomplete"
      }}</badge>
    </td>
    <td class="col-5">{{ report.date }}</td>
    <td class="col-3">{{ report.tutor_name }}</td>
    <td class="col-2 text-right">
      <base-button
        outline
        type="warning"
        class="btn-sm"
        @click="$emit('clicked', report)"
        v-if="!completed && $store.state.userRole == 'tutor'"
        >Fill in
      </base-button>
      <base-button
        outline
        class="btn-sm"
        type="info"
        v-else-if="completed"
        @click="$emit('clicked', report)"
        >Open</base-button
      >
    </td>
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
      completed: this.report_prop.students != null
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
