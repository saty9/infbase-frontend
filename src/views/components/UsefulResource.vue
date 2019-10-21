<template>
  <div class="container">
    <div v-if="$store.state.userRole == 'tutor' || $store.state.userRole == 'admin'">
      <div v-if="edit_mode">
        <textarea
                class="form-control"
                rows="3"
                v-model="edit_resource_body">
        </textarea>
        <base-button type="secondary" @click="edit_mode=false">Cancel</base-button>
        <base-button type="primary" @click="$emit('update-resource', resource, edit_resource_body); edit_mode=false">Update</base-button>
      </div>
      <div v-else>
        <vue-markdown v-bind:source="resource.body"></vue-markdown>
        <base-button type="info" @click="edit_mode=true; edit_resource_body= this.resource.body">Edit</base-button>
        <base-button type="danger" @click="$emit('delete-resource', resource)">Delete</base-button>
      </div>
    </div>
    <div v-else>
      <vue-markdown v-bind:source="resource.body"></vue-markdown>
    </div>
  </div>
</template>
<script>
  import VueMarkdown from "vue-markdown/src/VueMarkdown";
  import BaseButton from "../../components/BaseButton";

  export default {
    name: "useful_resource",
    components: {
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

    }
  };
</script>
<style>
</style>
