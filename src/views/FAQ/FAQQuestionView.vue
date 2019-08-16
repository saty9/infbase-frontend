<template>
    <section class="section">
        <QuestionDetail :question_id="this.$route.params.id"></QuestionDetail>
    </section>
</template>
<script>
import QuestionDetail from "../../components/FAQ/QuestionDetail";

export default {
  name: "faq_detail",
  components: {
    QuestionDetail
  },
};
</script>
