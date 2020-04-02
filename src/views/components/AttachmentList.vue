<template>
  <div>
    <template v-if="attachments">
    <ul>
      <div v-if="edit_mode">
        <li v-for="(file,index) in file_meta">
      <span v-if="file.file" :key="re_render">
        <s v-if="file.deleted">{{ file.file.file.name }}</s>
        <span v-else-if="file.new">{{ file.file.name }}</span>
        <span v-else="file.new">{{ file.file.file.name }}</span>
        <base-button type="danger" @click="file.deleted=!file.deleted; re_render+=1">Delete</base-button>
      </span>
          <span v-else>
            New File: <input type="file" @change="processFile($event, file)">
            <base-button type="danger" @click="file_meta.splice(index,1)">X</base-button>
      </span>
        </li>
      </div>
      <div v-else>
        <li v-for="file in file_meta">
          <a v-bind:href="file.file.file.path">{{ file.file.file.name }}</a>
        </li>
      </div>
    </ul>
    <base-button v-if="edit_mode" type="success" @click="add_file">Add file</base-button>
    </template>
    <template v-else>
      Pending...
    </template>
  </div>
</template>
<script>
  import BaseButton from "../../components/BaseButton";

  export default {
    name: "attachment_list",
    components: {
      BaseButton
    },
    props: {
      attachments: {
        type: Array,
        description: "attachments to display",
        optional: true
      },
      edit_mode: {
        type: Boolean
      }
    },
    mounted: function () {
    },
    watch: {
      attachments: function(){
        let new_meta = [];
        this.attachments.forEach(x => new_meta.push({file: x}));
        this.file_meta = new_meta;
      }
    },
    data: function () {
      let new_meta = [];
      if (this.attachments) {
        this.attachments.forEach(x => new_meta.push({file: x}));
      }
      return {
        file_meta: new_meta,
        re_render: 0
      }
    },
    methods: {
      sync: function (resource_id) {
        console.log("syncing resources");
        let that = this;

        let promises = [];

        //sends all files that are changed or new
        this.file_meta.forEach(function (x) {
          if (x.new && !x.deleted){
            var formData = new FormData();
            formData.append("document", x.file);
            formData.append("useful_resource_id", resource_id);
            console.log(formData);
            promises.push(that.axios.post('/api/useful_resource_attachments',
              formData,
              {
              headers: {
                'Content-Type': null,
              }
            }).then(function (response) {
              x.file = {};
              x.file.id = response.data.id;
              x.file.file = response.data.file;
              x.new = false;
            }))
          } else if (x.deleted) {
            promises.push(that.axios.delete("/api/useful_resource_attachments/" + x.file.id).then(function (response) {
              let index = that.file_meta.indexOf(x);
              if (index > -1) {
                that.file_meta.splice(index, 1);
              }
            }))
          }
        });
        return Promise.all(promises).then(() => {
          let out = [];
          that.file_meta.forEach((item) => {out.push(item.file)});
          return out
        }).catch(() => {alert("An error occurred while uploading files")})
      },
      add_file: function () {
        console.log("File add clicked");
        this.file_meta.push({file: null, new: true});
      },
      processFile(event, file) {
        console.log(event.target.files);
        file.file = event.target.files[0]
      }
    }
  };
</script>
<style>
</style>
