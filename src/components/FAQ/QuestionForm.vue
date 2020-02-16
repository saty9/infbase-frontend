<template>
  <div class="container">
    <div>
      <h4 class="text-primary text-center">{{ title_string }}</h4>
      <form>
        <BaseInput
          placeholder="Question Title"
          v-model="form_data.question.title"
          :valid="form_validity.title"
          @input="title_changed"
        ></BaseInput>
        <transition name="fade">
          <div v-if="suggestions.length">
            <h6>Questions that may answer your query:</h6>
            <div v-for="suggestion in suggestions" :key="'s'+suggestion.id">
              <router-link
                      :to="{ name: 'faq_detail', params: { id: suggestion.id } }"
              >
                {{ suggestion.title }}
              </router-link>
            </div>
            <br />
            <br />
          </div>
        </transition>
        <div :class="form_validity.body == false ? 'has-danger is-invalid' : ''">
          <Editor v-bind:options="editor_options" v-model="form_data.question.body"/>
        </div>
        <br />
        <BaseCheckbox
          v-model="form_data.question.anonymous" 
          v-show="$store.state.userRole == 'student'"
        >
          Ask Anonymously
        </BaseCheckbox>
        <br />
        <label for="course_options" class="font-weight-bold">Course (required):</label>
        <div class="row" id="course_options">
          <div v-for="course in courses" class="col-sm-4" :key="course.name">
            <base-radio
              v-bind:name="String(course.id)"
              class="mb-3"
              v-model="form_data.question.course_id"
            >
              {{ course.name }}
            </base-radio>
          </div>
        </div>
        <br />
        <v-select
          ref="tag_select"
          class="w-100"
          label="name"
          :options="tags"
          v-model="form_data.tags"
          multiple
          taggable
          placeholder="Tags"
          @search:focus="fix_readonly"
          v-b-tooltip.hover.top
          title="select a tag or start typing and press enter to add a tag. (tags that dont already exist will be created when you submit the form)">
        </v-select>
        <br />
        <br />
        <div v-if="selected_session_start == null"
             :class="form_validity.teaching_session == false ? 'has-danger is-invalid' : ''">
          <base-button type="secondary" v-on:click="session_modal_open = true">
            Select a Session (required)
          </base-button>
        </div>
        <div v-else>
          {{ selected_session_start }}
          <base-button class="ml-2"
                       v-on:click="selected_session_start = null; form_data.question.teaching_session_id = null"
            >Reset</base-button
          >
        </div>
        <br />
        <div v-if="$store.state.userRole != 'student'">
          <BaseInput
            :valid="form_validity.interest"
            placeholder="Number of students showing interest"
            input_type="number"
            v-model="form_data.interest"></BaseInput>
          <div :class="form_validity.answer == false ? 'has-danger is-invalid' : ''">
            <Editor v-bind:options="editor_options" v-model="form_data.answer"/>
          </div>
        </div>
        <br />
        <base-button block type="primary" v-on:click="submitForm">
          Submit
        </base-button>
      </form>
    </div>
    <modal :show.sync="session_modal_open" modalClasses="wider">
      <h6 slot="header" class="modal-title" id="modal-title-default">
        Session
      </h6>
      <session-schedule :scope="3" :on_select="session_selected" />
    </modal>
  </div>
</template>

<script>
import 'tui-editor/dist/tui-editor.css';
import 'tui-editor/dist/tui-editor-contents.css';
import 'codemirror/lib/codemirror.css';
import Editor from '@toast-ui/vue-editor/src/Editor.vue';
import default_editor_options from "../../default_editor_options";

import BaseInput from "../../components/BaseInput";
import BaseCheckbox from "../../components/BaseCheckbox";
import BTooltip from "bootstrap-vue/es/directives/tooltip/tooltip";
import SessionSchedule from "../../views/admin/Schedule/Schedule";
import Modal from "../Modal";

export default {
  name: "faq_ask",
  components: {
    BaseInput,
    BaseCheckbox,
    SessionSchedule,
    Modal,
    Editor
  },
  directives: {
    BTooltip
  },
  data() {
    return {
      courses: [],
      tags: [],
      form_validity: {
        title: null,
        body: null,
        course: null,
        teaching_session_id: 1,
        course_id: 0,
        teaching_session: null
      },
      form_data: {
        question: {
          title: "",
          body: "",
          anonymous: false,
          course: null,
          teaching_session_id: null,
          course_id: ""
        },
        tags: [],
        interest: null,
        answer: "Answer"
      },
      selected_session_start: null,
      suggestions: [],
      session_modal_open: false,
      editor_options: default_editor_options,
    };
  },
  mounted: function () {
    this.getOptions();
  },
  computed: {
    title_string: function () {
      return this.$store.state.userRole == "student"
        ? "Ask a Question"
        : "Add a Question";
    }
  },
  methods: {
    getOptions: function() {
      let v = this;
      this.axios.get("/api/courses").then(function (response) {
        v.courses = response.data;
      });
      this.axios.get("/api/topics").then(function (response) {
        v.tags = response.data;
      });
    },
    submitForm: function () {
      if (this.form_valid()) {
        //this.form_data.question.course_id = this.form_data.question.course.id;
        let router = this.$router;
        this.axios
          .post("/api/questions", this.form_data)
          .then(function(response) {
            router.push({
              name: "faq_detail",
              params: { id: response.data.id }
            });
          });
      } else {
        this.form_validity.title = this.form_data.question.title ? null : false;
        this.form_validity.body = this.form_data.question.body ? null : false;
        this.form_validity.course = this.form_data.question.course ? null : false;
        this.form_validity.interest = (this.form_data.interest >= 0 && this.form_data.interest != null)  ? null : false;
        this.form_validity.answer = this.form_data.answer != "Answer" ? null : false;
        this.form_validity.teaching_session = this.form_data.question.teaching_session_id != null;
      }
    },
    form_valid: function () {
      let tutor_satisfied = (this.$store.state.userRole == "student" ||
        (parseInt(this.form_data.interest) >= 0 && this.form_data.answer != "Answer"));
      return (this.form_data.question.title != "" &&
        this.form_data.question.body != "" &&
        this.form_data.question.course_id != "" &&
        this.form_data.question.teaching_session_id &&
        tutor_satisfied
      )
    },
    title_changed: function (new_title) {
      let self = this;
      if (new_title.length >= 3) {
        this.axios
          .get("/api/questions/search", {
            params: { search_string: new_title },
          })
          .then(function (response) {
            self.suggestions = response.data;
          });
      }
    },
    session_selected: function(event) {
      this.session_modal_open = false;
      this.form_data.question.teaching_session_id = event[0].id;
      this.selected_session_start = event[2].start + " " + event[0].start_date;
    },
    fix_readonly: function () {
      this.$refs.tag_select.$refs.search.readOnly = false
    }
  }
};
</script>
<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
