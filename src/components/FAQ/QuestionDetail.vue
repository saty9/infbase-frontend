<template>
    <div class="container-fluid">
        <div class="row">
            <h3>{{question.title}}</h3>
        </div>
        <div class="row">
            <div class="tags" v-for="topic in question.topics">
                <a href="#" class="badge badge-pill badge-primary">{{topic.name}}</a>
            </div>
        </div>
        <div class="row">
            <div class="votes col-md-1">
                <div class="mini-counts"><span>{{question.vote_count}}</span></div>
                <div>{{question.vote_count | pluralize('vote') }}</div>
            </div>
            <div class="col-md-8">
                {{question.body}}
            </div>
        </div>
        <div class="row question-end">
            <div class="col-md-1"></div>
            <div class="col-md-8">
                {{question.created_at | moment("MMM Do YYYY")}}
            </div>
        </div>

        <div v-for="answer in question.answers">
                <div class="row">
                    <div class="col-md-1"></div>
                    <div class="col-md-8">
                        {{answer.body}}
                    </div>
                </div>
                <div class="row answer">
                    <div class="col-md-1"></div>
                    <div class="col-md-8">
                        {{answer.created_at | moment("MMM Do YYYY")}}
                    </div>
                </div>
        </div>
    </div>
</template>
<script>
  export default {
    name: "question-detail",
    props: {
      question: Object
    },
  };
</script>
<style>
    .tags {
        line-height: 18px;
        float: left;
    }

    .votes {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 5em;
        float: left;
    }

    .question-end {
        border-bottom: 1px solid;
    }

    .answer {
        border-bottom: 1px solid;
    }
</style>
