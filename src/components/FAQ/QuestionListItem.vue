<template>
    <div class="question narrow">
        <div class="summary">
            <h3>
                <router-link :to="{name: 'faq_detail', params: { id: question.id }}" >{{question.title}}</router-link>
            </h3>
            <div class="tags" v-for="topic in question.topics">
                <a href="#" class="badge badge-pill badge-primary">{{topic.name}}</a>
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
  };
</script>
<style>
    .question{
        display: flex;
        border-bottom: 1px solid;
        align-items: center;
        flex-direction: row;
    }
    .question-properties{
        margin-left: auto;
    }
    .tags {
        line-height: 18px;
        float: left;
    }
    .votes{
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 5em;
    }
    .summary{
    }
</style>
