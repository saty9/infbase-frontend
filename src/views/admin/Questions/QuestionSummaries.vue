<template>
  <section>
    <base-dropdown style="display: block" menuClasses="block-dropdown">
      <base-button block slot="title" type="secondary" class="dropdown-toggle">
        {{scope.name}}
      </base-button>
      <div v-for="s in scopes">
        <a class="dropdown-item" href="#" @click="change_scope(s)">{{s.name}}</a>
      </div>
    </base-dropdown>
    <h2>Courses</h2>
    <table class="table">
      <thead>
      <th scope="col" class="w-50">Name</th>
      <th scope="col">Questions Asked</th>
      <th scope="col">Votes</th>
      </thead>
      <tbody v-for="course in course_stats">
      <tr>
        <td>
          <router-link :to="{ name: 'faq_index', params: { course: course }}">{{course.name}}</router-link>
        </td>
        <td>{{course.count}}</td>
        <td>{{course.vote_count}}</td>
      </tr>
      </tbody>
    </table>
    <h2>Tags</h2>
    <table class="table">
      <thead>
      <th scope="col" class="w-50">Name</th>
      <th scope="col">Questions Asked</th>
      <th scope="col">Votes</th>
      </thead>
      <tbody v-for="tag in tag_stats">
      <tr>
        <td>
          <router-link :to="{ name: 'faq_index', params: { tag: tag }}">{{tag.name}}</router-link>
        </td>
        <td>{{tag.count}}</td>
        <td>{{tag.vote_count}}</td>
      </tr>
      </tbody>
    </table>
  </section>
</template>
<script>
  import QuestionList from "../../components/QuestionList";
  import BaseDropdown from "../../../components/BaseDropdown";

  let scopes = [
    {
      'name': '1 Week',
      'value': new Date(Date.now() - 7 * 60 * 60 * 24 * 1000)
    },
    {
      'name': '1 Month',
      'value': new Date(Date.now() - 31 * 60 * 60 * 24 * 1000)
    },
    {
      'name': '1 Year',
      'value': new Date(Date.now() - 365 * 60 * 60 * 24 * 1000)
    }
  ];

  export default {
    components: {
      QuestionList,
      BaseDropdown,
    },
    data() {
      return {
        course_stats: [],
        tag_stats: [],
        scope: scopes[0],
        scopes: scopes
      }
    },
    mounted: function () {
      this.change_scope(this.scope)
    },
    methods: {
      change_scope: function (scope) {
        this.scope = scope;
        let self = this;
        this.axios.get("/api/courses/stats",{'params':{'since': scope.value}}).then(function (response) {
          self.course_stats = response.data;
        });
        this.axios.get("/api/topics/stats", {'params':{'since': scope.value}}).then(function (response) {
          self.tag_stats = response.data;
        });
      }
    }
  };
</script>
<style>
  .block-dropdown {
    min-width: 100% !important;
  }
</style>
