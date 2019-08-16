<template>
  <div class="container" v-if="questions.length">
    <div class="container" v-for="question in questions">
      <question-list-item :question="question" @refresh="$emit('refresh', $event)"></question-list-item>
    </div>
  </div>
  <div class="container text-center" v-else>
    {{noQuestionsMessage}}
  </div>
</template>
<script>
  import QuestionListItem from '../../components/FAQ/QuestionListItem'

  export default {
    components: {
      QuestionListItem
    },
    props: {
      filterTag: {
        type: Number,
        description: "Tag to filter for"
      },
      filterAskedByMe: {
        type: Boolean,
        description: "Filter to questions asked by current user"
      },
      filterCourse: {
        type: Number,
        default: null,
        description: "ID of course to filter questions to"
      },
      noQuestionsMessage: {
        type: String,
        default: "There are no questions matching that query",
        description: "Message to display if no questions are found matching given criteria"
      },
      orderBy:{
        type: String,
        default: 'vote_count',
        description: 'ordering of questions'
      },
      filterUpcomingSession:{
        type: Boolean,
        description: "Filter to questions asked for the next session"
      },
      filterUserCourses:{
        type: Boolean,
        description: "Filter to courses this user is on"
      },
      filterAnswered:{
        type: Boolean,
        description: "Filter to answered questions"
      },
      filterUnAnswered:{
        type: Boolean,
        description: "Filter to unanswered questions"
      },
      searchString:{
        type: String,
        description: "Search string for questions"
      },
      theWatched: {
        type: Number,
        default: 0,
        description: "change this after changing other props to trigger an update (I tried calling methods but the internal props dont update immediately)"
      }
    },
    mounted: function () {
      this.fetchData()
    },
    data: function () {
      return {
        questions: []
      }
    },
    watch: {
      theWatched: function () {
        this.fetchData()
      }
    },
    methods: {
      fetchData: function () {
        let v = this;
        let params = {
          course: this.filterCourse,
            asked_by_me: this.filterAskedByMe,
            tag: this.filterTag,
            order_by: this.orderBy,
            upcoming_session: this.filterUpcomingSession,
            user_courses: this.filterUserCourses,
            answered: this.filterAnswered,
            unanswered: this.filterUnAnswered,
            search_string: this.searchString
        };
        Object.keys(params).forEach((key) => (params[key] == false) && delete params[key]);
        this.axios.get('/api/questions', {
          params: params
        }).then(function (response) {
          v.questions = response.data;
        });
      },
    }
  };
</script>
<style>
</style>
