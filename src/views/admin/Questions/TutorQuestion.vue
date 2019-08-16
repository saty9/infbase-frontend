<template>
  <section>
    <div class="row justify-content-md-center">
      <div class="col">
        <router-link style="display: block" to="/faq/ask" class="btn btn-success">
          Add a Question
        </router-link>
      </div>
    </div>
    <br/>
    <div class="row justify-content-md-center">
      <div class="col">
        <router-link style="display: block" to="/faq" class="btn btn-primary">
          All Questions
        </router-link>
      </div>
    </div>
    <h2>Next Session Questions</h2>
    <question-list filter-upcoming-session class="qlist"></question-list>
    <h2>Unanswered Questions</h2>
    <question-list filter-user-courses filter-un-answered class="qlist"></question-list>
  </section>
</template>
<script>
  import QuestionList from "../../components/QuestionList";

  export default {
    components: {
      QuestionList
    },
  };
</script>
<style>
  .qlist{
    overflow:scroll;
    height:400px;
  }
</style>
