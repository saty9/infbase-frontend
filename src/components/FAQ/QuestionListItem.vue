<template>
  <div v-bind:class="question_classes">
    <div class="summary">
      <h3>
        <router-link :to="{name: 'faq_detail', params: { id: question.id }}">{{question.title}}</router-link>
      </h3>
      <div class="tags" v-for="topic in question.topics">
        <a href="" class=" badge badge-pill badge-primary" @click.prevent="tag_clicked(topic)">
          {{topic.name}}
        </a>
      </div>
      <div v-if="$store.state.userRole != 'student' && unresolved_followups" style="color: red">
        Unresolved Followups
      </div>
      <br/>
      <div>{{question.created_at | moment("hh:mm MMM Do YYYY")}}</div>
    </div>
    <div class="question-properties">
      <div class="votes">
        <div class="mini-counts"><span>{{question.vote_count}}</span></div>
        <div>{{question.vote_count | pluralize('vote') }}</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "question-list-item",
    props: {
      question: Object
    },
    computed: {
      question_classes: function(){
        return {
          question: true,
          narrow: true,
          "unresolved-warning": !this.question.resolved,
        }
      },
      unresolved_followups: function() {
        return this.question.question_followups.some(q => !q.resolved)
      }
    },
    methods: {
      tag_clicked: function (tag){
        if (this.$route.name == 'faq_index'){
          this.$emit("refresh", tag)
        } else {
          this.$router.push({name: 'faq_index', params: { tag: tag }})
        }

      }
    }
  };
</script>
<style>
  .question {
    display: flex;
    border-bottom: 1px solid;
    align-items: center;
    flex-direction: row;
  }

  .question-properties {
    margin-left: auto;
  }

  .tags {
    line-height: 18px;
    float: left;
  }

  .votes {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 5em;
  }

  .summary {
  }

  .unresolved-warning {
    background-color: #fb6340ad !important;
  }
</style>
