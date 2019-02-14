<template>
    <section class="section">
        <QuestionDetail :question="question"></QuestionDetail>
    </section>
</template>
<script>
import QuestionDetail from "../../components/FAQ/QuestionDetail";

export default {
  name: "faq_detail",
  components: {
    QuestionDetail
  },
  mounted: function () {
    this.fetchData()
  },
  data: function () {
    return {
      question: {}
    }
  },
  methods: {
    fetchData: function () {
      let v = this;
      this.axios.get('/api/questions/' + this.$route.params.id ).then(function (response) {
        v.question = response.data;
      });
    }
  }
};
</script>
