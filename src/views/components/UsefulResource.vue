<template>
  <div class="container">
    <div v-if="$store.state.userRole == 'tutor' || $store.state.userRole == 'admin'">
      <div v-if="edit_mode">
        <Editor style="min-width: 100%" v-bind:options="editor_options" v-model="edit_resource_body"/>
        <div>
          <v-select
                  ref="tag_select"
                  class="w-100"
                  label="name"
                  :options="tags"
                  v-model="edit_tags"
                  multiple
                  taggable
                  placeholder="Tags"
                  @search:focus="fix_readonly"
                  v-bubble:option:created
                  v-b-tooltip.hover.top
                  title="select a tag or start typing and press enter to add a tag. (tags that dont already exist will be created when you submit the form)">
          </v-select>
        </div>
        <base-checkbox v-model="resource.restricted">Tutor Only?</base-checkbox>
        <attachment_list ref="attachments" v-bind:attachments="resource.useful_resource_attachments" v-bind:edit_mode="edit_mode"/>
        <br/>
        <base-button type="secondary" @click="edit_mode=false">Cancel</base-button>
        <base-button type="primary" @click="$emit('update-resource', resource, edit_resource_body, edit_tags); edit_mode=false; sync_attachments()">Update</base-button>
        <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">Markdown Cheatsheet</a>
      </div>
      <div v-else>
        <vue-markdown v-bind:source="resource.body" v-bind:html="false"></vue-markdown>
        <div class="row">
          <div class="tags" v-for="topic in resource.topics">
            <router-link :to="{name: 'useful_resources_by_topic', params: { topic_id: topic.id }}" class="badge badge-pill badge-primary">{{topic.name}}</router-link>
          </div>
        </div>
        <base-checkbox v-model="resource.restricted" disabled v-if="resource.restricted">Tutor Only</base-checkbox>
        <attachment_list ref="attachments" v-bind:attachments="resource.useful_resource_attachments" v-bind:edit_mode="edit_mode"/>
        <base-button type="info" @click="edit_mode=true; edit_resource_body= resource.body">Edit</base-button>
        <base-button type="danger" @click="$emit('delete-resource', resource)">Delete</base-button>
      </div>
    </div>
    <div v-else class="row">

      <div class="votes col-md-1">
        <div class="mini-counts"><span>{{resource.votes}}</span></div>
        <div>{{resource.votes | pluralize('vote') }}</div>

        <button type="button" class="btn btn-outline-default " v-if="!resource.user_voted" v-on:click="upvote"><i
                class="fa fa-plus">1</i>
        </button>
        <button type="button" class="btn btn-success" v-else v-on:click="remove_vote"><i class="fa fa-check"></i>
        </button>
      </div>

      <div class="col-md-10">
        <div class="row">
          <div class="tags" v-for="topic in resource.topics">
            <router-link :to="{name: 'useful_resources_by_topic', params: { topic_id: topic.id }}" class="badge badge-pill badge-primary">{{topic.name}}</router-link>
          </div>
        </div>
        <vue-markdown v-bind:source="resource.body" v-bind:html="false" ></vue-markdown>
        <attachment_list ref="attachments" v-bind:attachments="resource.useful_resource_attachments" v-bind:edit_mode="edit_mode"/>
      </div>
    </div>
  </div>
</template>
<script>
  import VueMarkdown from "vue-markdown/src/VueMarkdown";
  import BaseButton from "../../components/BaseButton";
  import Attachment_list from "./AttachmentList";
  import default_editor_options from "../../default_editor_options";
  import Editor from '@toast-ui/vue-editor/src/Editor.vue';
  import BTooltip from "bootstrap-vue/es/directives/tooltip/tooltip";

  export default {
    name: "useful_resource",
    directives: {
      BTooltip
    },
    components: {
      Attachment_list,
      VueMarkdown,
      BaseButton,
      Editor
    },
    props: {
      resource: {
        type: Object,
        description: "resource to display"
      },
      tags: {
        type: Array,
        description: "array of pre-existing tags"
      }
    },
    data: function () {
      return {
        edit_mode: false,
        edit_resource_body: this.resource.body,
        editor_options: default_editor_options,
        edit_tags: this.resource.topics,
      }
    },
    methods: {
      sync_attachments: function(){
        this.$refs.attachments.sync(this.resource.id);
      },
      upvote: function () {
        this.resource.votes += 1;
        this.resource.user_voted = true;
        this.axios.post('/api/useful_resources/' + this.resource.id + '/vote_for')
      },
      remove_vote: function () {
        this.resource.votes -= 1;
        this.resource.user_voted = false;
        this.axios.post('/api/useful_resources/' + this.resource.id + '/remove_vote')
      },
      fix_readonly: function () {
        this.$refs.tag_select.$refs.search.readOnly = false
      }
    }
  };
</script>
<style>
  .votes {
    display: block;
    flex-direction: column;
    align-items: center;
    min-width: 5em;
    float: left;
  }
</style>
