<template>
  <div class="container">
    <div class="row">
      <h3>{{question.title}}</h3>
    </div>
    <div class="row">
      <div class="tags" v-for="topic in question.topics">
        <a href="" class="badge badge-pill badge-primary">{{topic.name}}</a>
      </div>
    </div>
    <div class="row">
      <div class="votes col-md-1">
        <div class="mini-counts"><span>{{question.votes}}</span></div>
        <div>{{question.votes | pluralize('vote') }}</div>

        <button type="button" class="btn btn-outline-default " v-if="!question.voted" v-on:click="upvote"><i
                class="fa fa-plus">1</i>
        </button>
        <button type="button" class="btn btn-success" v-else v-on:click="remove_vote"><i class="fa fa-check"></i>
        </button>
      </div>
      <div class="col-md-10">
        {{question.body}}
      </div>
      <div class="col" v-if="$store.state.userRole!='student'">
        <base-dropdown>
          <div slot="title" class="dropdown-toggle">
            <i class="fa fa-ellipsis-v"></i>
          </div>
          <button class="dropdown-item" @click="delete_question(question)">Delete</button>
          <button class="dropdown-item" @click="edit_question(answer)">Edit</button>
        </base-dropdown>
      </div>
    </div>
    <div class="row question-end">
      <div class="col-md-1"></div>
      <div class="col-md-8">
        {{question.created_at | moment("MMM Do YYYY")}}
      </div>
    </div>

    <div v-if="question.answers.length">
      <div v-for="answer in question.answers">
        <div class="row">
          <div class="col-md-1"></div>
          <div class="col-md-10">
            {{answer.body}}
          </div>
          <div class="col" v-if="$store.state.userRole!='student'">
            <base-dropdown>
              <div slot="title" class="dropdown-toggle">
                <i class="fa fa-ellipsis-v"></i>
              </div>
              <button class="dropdown-item" @click="delete_answer(answer)">Delete</button>
              <button class="dropdown-item" @click="edit_answer(answer)">Edit</button>
            </base-dropdown>
          </div>
        </div>
        <div class="row answer">
          <div class="col-md-1"></div>
          <div class="col">
            {{answer.created_at | moment("MMM Do YYYY")}}
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="row">
        <div class="col-md-1">Your Answer:</div>
        <div class="col-md-10">
          <textarea style="min-width: 100%" v-model="answer_text"></textarea>
        </div>
      </div>
      <div class="row">
        <div class="col-md-1"></div>
        <div class="col">
          <base-button @click="submit_answer">Submit</base-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import BaseDropdown from "../BaseDropdown";

  export default {
    name: "question-detail",
    components: {
      BaseDropdown
    },
    props: {
      question_id: String,
    },
    data() {
      return {
        question: {answers: []},
        answer_text: "",
        question_text: ""
      }
    },
    mounted: function () {
      this.fetchData()
    },
    methods: {
      upvote: function () {
        this.question.votes += 1;
        this.question.voted = true;
        this.axios.post('/api/questions/' + this.question_id + '/vote_for')
      },
      remove_vote: function () {
        this.question.votes -= 1;
        this.question.voted = false;
        this.axios.post('/api/questions/' + this.question_id + '/remove_vote')
      },
      fetchData: function () {
        let v = this;
        this.axios.get('/api/questions/' + this.question_id).then(function (response) {
          v.question = response.data;
        });
      },
      delete_answer: function (answer) {
        this.axios.delete('/api/answers/' + answer.id);
        this.question.answers = this.question.answers.filter(function (value, index, arr) {
          return answer != value;
        });
      },
      delete_question: function (question) {
        this.axios.delete('/api/questions/' + question.id);
        this.$router.push({'name': 'faq_index'});
      },
      submit_answer: function () {
        let self = this;
        this.axios.post('/api/answers/', {
          answer: {
            question_id: this.question_id,
            body: this.answer_text,
          }
        }).then(response => {
          console.log(response);
          self.question.answers = [response.data];
        });
      },
    }
  };
</script>
<style>
  .tags {
    line-height: 18px;
    float: left;
  }

  .votes {
    display: block;
    flex-direction: column;
    align-items: center;
    min-width: 5em;
    float: left;
  }

  .question-end {
    padding-bottom: 5px;
    border-bottom: 1px solid;
  }

  .answer {
    border-bottom: 1px solid;
  }
</style>
