<template>
  <section class="section">
    <div class="section" v-if="resources.length">
      <div class="container" v-for="resource in resources">
        <UsefulResource v-bind:resource="resource"
                        v-bind:tags="tags"
                        v-on:delete-resource="delete_resource"
                        v-on:update-resource="update_resource"
                        @option:created="addTopic"
        />
        <br>
      </div>
    </div>
    <div class="section text-center" v-else>
      No resources have been added yet
    </div>
    <div class="section container" v-if="show_add_form">
      <form
              id="loginForm"
              role="form"
      >
        <b>Finish adding a resource and then edit it to upload files</b>
        <Editor style="min-width: 100%" v-bind:options="editor_options" v-model="newresourcebody"/>
        <br>
        <v-select
                ref="tag_select"
                class="w-100"
                label="name"
                :options="tags"
                v-model="newresourcetags"
                multiple
                taggable
                placeholder="Tags"
                @search:focus="fix_readonly"
                @option:created="addTopic"
                v-b-tooltip.hover.top
                title="select a tag or start typing and press enter to add a tag. (tags that dont already exist will be created when you submit the form)"
        />
        <br>
        <base-checkbox v-model="newresourcerestricted">Tutor Only?</base-checkbox>
        <br>
        <base-button type="success" @click="submit_new_resource">Submit</base-button>
        <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">Markdown Cheatsheet</a>
      </form>
    </div>
    <div class="section text-center" v-else-if="course_mode && ($store.state.userRole == 'tutor' || $store.state.userRole == 'admin')">
      <base-button type="success" @click="add_resource">Add Useful Resource</base-button>
    </div>
  </section>
</template>
<script>
  import UsefulResource from "./UsefulResource";
  import BaseButton from "../../components/BaseButton";
  import default_editor_options from "../../default_editor_options";
  import Editor from '@toast-ui/vue-editor/src/Editor.vue';
  import BTooltip from "bootstrap-vue/es/directives/tooltip/tooltip";

  export default {
    name: "course_useful_resources",
    directives: {
      BTooltip
    },
    components: {
      UsefulResource,
      BaseButton,
      Editor
    },
    props: {
      course_id: {
        type: String
      },
      topic_id: {
        type: String
      }
    },
    mounted: function () {
      this.fetchData();
      this.getTopics();
    },
    data: function () {
      return {
        resources: [],
        show_add_form: false,
        newresourcebody: null,
        newresourcerestricted: false,
        newresourcetags: [],
        editor_options: default_editor_options,
        tags: [],
        course_mode: Boolean(this.course_id),
      }
    },
    watch: {
      course_id: function () {
        this.fetchData();
      }
    },
    methods: {
      fetchData: function () {
        let v = this;
        let params = {
          course_id: this.course_id,
          topic_id: this.topic_id,
        };
        this.axios.get('/api/useful_resources', {
          params: params
        }).then(function (response) {
          v.resources = response.data[0];
          response.data[1].forEach(function(user_vote) {
            let r = v.resources.filter(resource => resource.id == user_vote.useful_resource_id);
            if (r.length){
              r[0].user_voted = true
            }
          });
        });

      },
      add_resource: function () {
        this.newresourcebody = "# Title\n" +
          "normal __Bold__ _italics_ ~~cross~~\n" +
          "**bold** *italics*";
        this.show_add_form = true;
      },
      submit_new_resource: function () {
        let self = this;
        this.axios.post("/api/useful_resources", {
          useful_resource: {
            body: this.newresourcebody,
            course_id: this.course_id,
            restricted: this.newresourcerestricted,
          },
          tags: this.newresourcetags,
        })
          .then(response => {
            this.show_add_form = false;
            response.data.topics = self.newresourcetags;
            this.resources.push(response.data);
          })
          .catch(error => this.$store.commit("ADD_ALERT", "something went wrong"));
      },
      delete_resource: function (event) {
        console.log(event);
        if (confirm("Are you sure you want to delete this resource?")) {
          this.axios.delete("/api/useful_resources/" + event.id).then(response => {
            this.resources = this.resources.filter(res => res.id != event.id);
          })
        }
      },
      update_resource: function (event, updated_body) {
        console.log(event);
        this.axios.patch("/api/useful_resources/" + event.id, {
          useful_resource: {
            body: updated_body,
            restricted: event.restricted,
          },
          tags: event.topics,
        }).then(response => {
          this.resources.find(res => res.id == event.id).body = updated_body;
        });
      },
      getTopics: function() {
        let v = this;
        this.axios.get("/api/topics").then(function (response) {
          v.tags = response.data;
        });
      },
      fix_readonly: function () {
        this.$refs.tag_select.$refs.search.readOnly = false
      },
      addTopic: function (event) {
        this.tags.push(event)
      },
    }
  };
</script>
