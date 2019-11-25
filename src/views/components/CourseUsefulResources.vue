<template>
  <section class="section">
    <div class="section" v-if="resources.length">
      <div class="container" v-for="resource in resources">
        <UsefulResource v-bind:resource="resource"
                        v-on:delete-resource="delete_resource"
                        v-on:update-resource="update_resource"></UsefulResource>
        <br>
      </div>
      <div class="container" v-if="$store.state.userRole == 'tutor' || $store.state.userRole == 'admin'">
        <base-button type="success" @click="add_resource">Add Useful Resource</base-button>
      </div>
    </div>
    <div class="section container" v-if="show_add_form">
      <form
              id="loginForm"
              role="form"
      >
              <textarea
                      class="form-control"
                      rows="3"
                      v-model="newresourcebody"></textarea>
        <br>
        <base-button type="success" @click="submit_new_resource">Submit</base-button>
        <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">Markdown Cheatsheet</a>
      </form>
    </div>
    <div class="section text-center" v-else-if="$store.state.userRole == 'tutor' || $store.state.userRole == 'admin'">
      No resources have been added yet.<br>
      Would you like to add the first one?<br>
      <base-button type="success" @click="add_resource">Add Useful Resource</base-button>
    </div>
    <div class="section text-center" v-else>
      No resources have been added yet
    </div>
  </section>
</template>
<script>
  import UsefulResource from "./UsefulResource";
  import BaseButton from "../../components/BaseButton";

  export default {
    name: "course_useful_resources",
    components: {
      UsefulResource,
      BaseButton
    },
    props: {
      course_id: {
        type: Number
      },
    },
    mounted: function () {
      this.fetchData()
    },
    data: function () {
      return {
        resources: [],
        show_add_form: false,
        newresourcebody: null,
      }
    },
    watch: {
      course_id: function () {
        this.fetchData()
      }
    },
    methods: {
      fetchData: function () {
        let v = this;
        let params = {
          course_id: this.course_id
        };
        this.axios.get('/api/useful_resources', {
          params: params
        }).then(function (response) {
          v.resources = response.data;
        });
      },
      add_resource: function () {
        this.newresourcebody = "# Title\n" +
          "normal __Bold__ _italics_ ~~cross~~\n" +
          "**bold** *italics*";
        this.show_add_form = true;
      },
      submit_new_resource: function () {
        this.axios.post("/api/useful_resources", {
          useful_resource: {
            body: this.newresourcebody,
            course_id: this.course_id,
          }
        })
          .then(response => {
            this.show_add_form = false;
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
            body: updated_body
          }
        }).then(response => {
          this.resources.find(res => res.id == event.id).body = updated_body;
        });
      },
    }
  };
</script>
