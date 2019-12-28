<template>
  <tr
    v-if="!deleted"
    class="row"
  >
    <td class="col">{{expertise.name}}</td>
    <td class="text-right col">
      <base-button
        outline
        type="warning"
        class="btn-sm"
        @click="deleteExpertise"
      >Remove</base-button>
    </td>
  </tr>
</template>
<script>
export default {
  props: {
    expertise: {
      type: Object,
      default: null,
      description: "Expertise object (:tutor_id, :course_id)"
    }
  },
  data() {
    return {
      deleted: false
    };
  },
  methods: {
    deleteExpertise() {
      this.axios
        .delete(`/api/admin/expertises/${this.expertise.id}`)
        .then(response => {
          this.deleteSuccessful(response);
        })
        .catch(error => this.deleteFailed(error));
    },
    deleteSuccessful(response) {
      this.deleted = true;
      this.$store.commit("ADD_ALERT", ["Expertise removed.", "success"]);
    },
    deleteFailed(response) {
      this.$store.commit("ADD_ALERT", ["Something went wrong.", "warning"]);
    }
  }
};
</script>
