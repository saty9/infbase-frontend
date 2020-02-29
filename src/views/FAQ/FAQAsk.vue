<template>
  <section class="section">
    <question-form v-bind:session_id="session_id"></question-form>
  </section>
</template>
<script>
  import QuestionForm from "../../components/FAQ/QuestionForm";

  export default {
    name: "faq_ask",
    data: function() {
      return {
        session_id: this.$route.params.session_id,
      }
    },
    components: {
      QuestionForm,
    },
  };
</script>