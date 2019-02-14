<template>
    <section class="section">
        <div class="text-center">
        <router-link to="/faq/ask" class="btn btn-success">
            Ask a Question
        </router-link>
        </div>
        <QuestionList></QuestionList>
    </section>
</template>
<script>
import QuestionList from "../components/QuestionList";

export default {
  name: "faq_index",
  components: {
    QuestionList
  }
};
</script>
