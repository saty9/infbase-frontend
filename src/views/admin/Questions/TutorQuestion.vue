<template>
  <section>
    <h2>Next Session Questions</h2>
    <question-list filter-upcoming-session></question-list>
    <h2>Unanswered Questions</h2>
    <question-list filter-user-courses filter-un-answered></question-list>
  </section>
</template>
<script>
  import QuestionList from "../../components/QuestionList";

  export default {
    components: {
      QuestionList
    }
  };
</script>
