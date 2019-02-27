<template>
  <section class="section">
    <question-form></question-form>
  </section>
</template>
<script>
  import QuestionForm from "../../components/FAQ/QuestionForm";

  export default {
    name: "faq_ask",
    components: {
      QuestionForm,
    },
  };
</script>