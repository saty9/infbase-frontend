<template>
  <div class="container">
    <div v-if="$store.state.userRole == 'tutor' || $store.state.userRole == 'admin'">
      <div v-if="edit_mode">
        <Editor style="min-width: 100%" v-bind:options="editor_options" v-model="edit_resource_body"/>
        <base-checkbox v-model="resource.restricted">Tutor Only?</base-checkbox>
        <attachment_list ref="attachments" v-bind:attachments="resource.useful_resource_attachments" v-bind:edit_mode="edit_mode"/>
        <br/>
        <base-button type="secondary" @click="edit_mode=false">Cancel</base-button>
        <base-button type="primary" @click="$emit('update-resource', resource, edit_resource_body); edit_mode=false; sync_attachments()">Update</base-button>
        <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">Markdown Cheatsheet</a>
      </div>
      <div v-else>
        <vue-markdown v-bind:source="resource.body" v-bind:html="false"></vue-markdown>
        <base-checkbox v-model="resource.restricted" disabled>Tutor Only</base-checkbox>
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

  export default {
    name: "useful_resource",
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
    },
    mounted: function () {
    },
    data: function () {
      return {
        edit_mode: false,
        edit_resource_body: this.resource.body,
        editor_options: default_editor_options,
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
