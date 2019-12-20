<template>
  <div class="container">
    <div v-if="$store.state.userRole == 'tutor' || $store.state.userRole == 'admin'">
      <div v-if="edit_mode">
        <textarea
                class="form-control"
                rows="3"
                v-model="edit_resource_body">
        </textarea>
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
    <div v-else>
      <vue-markdown v-bind:source="resource.body" v-bind:html="false"></vue-markdown>
      <attachment_list ref="attachments" v-bind:attachments="resource.useful_resource_attachments" v-bind:edit_mode="edit_mode"/>
    </div>
  </div>
</template>
<script>
  import VueMarkdown from "vue-markdown/src/VueMarkdown";
  import BaseButton from "../../components/BaseButton";
  import Attachment_list from "./AttachmentList";

  export default {
    name: "useful_resource",
    components: {
      Attachment_list,
      VueMarkdown,
      BaseButton
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
      }
    },
    methods: {
      sync_attachments: function(){
        this.$refs.attachments.sync(this.resource.id);
      }
    }
  };
</script>
<style>
</style>
