<template>
  <div class="container">
    <div class="row">
      <h3>{{question.title}}</h3>
    </div>
    <div class="row">
      <div class="tags" v-for="topic in question.topics">
        <router-link :to="{name: 'faq_index', params: { tag: topic }}" class="badge badge-pill badge-primary">{{topic.name}}</router-link>
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
        <div v-if="editing">
          <Editor style="min-width: 100%" v-bind:options="editor_options" v-model="question.body"/>
        </div>
        <vue-markdown v-else v-bind:source="question.body" v-bind:html="false"/>
      </div>
      <div class="col" v-if="can_edit_question()">
        <base-dropdown>
          <div slot="title" class="dropdown-toggle">
            <i class="fa fa-ellipsis-v"></i>
          </div>
          <button class="dropdown-item" @click="delete_question()">Delete</button>
          <button class="dropdown-item" @click="edit_question()">Edit</button>
        </base-dropdown>
      </div>
    </div>
    <div class="row question-end">
      <div class="col-md-1"></div>
      <div class="col-md-8">
        {{question.created_at | moment("MMM Do YYYY, HH:mm")}}
        <span v-if="question.updated_at != question.created_at">Updated: {{question.updated_at | moment("MMM Do YYYY, HH:mm")}}</span>
      </div>
    </div>
    <div v-if="editing" class="row">
      <div class="col-md-1"></div>
      <div class="col">
        <base-button @click="edit_question()">Cancel</base-button>
        <base-button @click="update_question()">Update</base-button>
      </div>
    </div>

    <div v-if="question.answers.length">
      <div v-for="answer in question.answers">
        <div class="row">
          <div class="col-md-1"></div>
          <div class="col-md-10" :key="watch_key">
            <div v-if="answer.editing">
              <Editor style="min-width: 100%" v-bind:options="editor_options" v-model="answer.body"/>
            </div>
            <vue-markdown v-else v-bind:source="answer.body" v-bind:html="false"/>
          </div>
          <div class="col" v-if="can_edit_answer(answer)">
            <base-dropdown>
              <div slot="title" class="dropdown-toggle">
                <i class="fa fa-ellipsis-v"></i>
              </div>
              <button class="dropdown-item" @click="delete_answer(answer)">Delete</button>
              <button class="dropdown-item" @click="edit_answer(answer)">Edit</button>
            </base-dropdown>
          </div>
        </div>
        <div v-if="answer.editing" class="row">
          <div class="col-md-1"></div>
          <div class="col">
            <base-button @click="edit_answer(answer)">Cancel</base-button>
            <base-button @click="update_answer(answer)">Update</base-button>
          </div>
        </div>
        <div class="row answer">
          <div class="col-md-1"></div>
          <div class="col">
            {{answer.created_at | moment("MMM Do YYYY, HH:mm")}}
            <span v-if="answer.updated_at != answer.created_at">Updated: {{answer.updated_at | moment("MMM Do YYYY, HH:mm")}}</span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="row">
        <div class="col-md-1">Your Answer:</div>
        <div class="col-md-10">
          <Editor style="min-width: 100%" v-bind:options="editor_options" v-model="answer_text"/>
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
  import VueMarkdown from "vue-markdown/src/VueMarkdown";
  import default_editor_options from "../../default_editor_options";
  import Editor from '@toast-ui/vue-editor/src/Editor.vue';

  export default {
    name: "question-detail",
    components: {
      BaseDropdown,
      VueMarkdown,
      Editor
    },
    props: {
      question_id: Number,
    },
    data() {
      return {
        question: {answers: []},
        answer_text: "",
        question_text: "",
        editor_options: default_editor_options,
        watch_key: 0,
        editing: false,
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
        this.axios.delete('/api/questions/' + this.question.id);
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
          self.question.answers.push(response.data);
        });
      },
      can_edit_question: function(){
        return this.$store.state.userRole != "student" || this.$store.state.userId == this.question.user_id;
      },
      edit_question: function () {
        if (this.editing){
          this.question.body = this.question.old_body;
        }
        this.question.old_body = this.question.body;
        this.editing = !this.editing;
        this.watch_key += 1;
      },
      update_question: function () {
        let self = this;
        this.axios.patch('/api/questions/' + this.question.id, {
          question: {
            body: this.question.body,
          }
        }).then(response => {
          console.log(response);
          self.editing = false;
          self.watch_key += 1;
        });
      },
      can_edit_answer: function(answer){
        return this.$store.state.userRole != "student" || this.$store.state.userId == answer.user.id;
      },
      edit_answer: function (answer) {
        if (answer.editing){
          answer.body = answer.old_body;
        }
        answer.old_body = answer.body;
        answer.editing = !answer.editing;
        this.watch_key += 1;
      },
      update_answer: function (answer) {
        let self = this;
        this.axios.patch('/api/answers/' + answer.id, {
          answer: {
            body: answer.body,
          }
        }).then(response => {
          console.log(response);
          answer.editing = false;
          self.watch_key += 1;
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
