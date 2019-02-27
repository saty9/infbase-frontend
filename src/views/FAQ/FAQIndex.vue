<template>
  <section class="section">
    <div class="container">
      <div class="row justify-content-md-center">
        <div class="col">
          <router-link style="display: block" to="/faq/ask" class="btn btn-success">
            Ask a Question
          </router-link>
        </div>
      </div>
      <br/>
      <div class="row">
        <div class="col">
          <font-awesome-icon icon='search'/>
          <base-input addon-left-icon="fa fa-search" placeholder="Search"></base-input>
        </div>
      </div>
      <br/>
      <div class="row">
        <div class="col">
          <base-button block type="primary" class="mb-3" @click="filters_modal = true">
            Filter
            <font-awesome-icon icon="filter"/>
          </base-button>
          <modal :show.sync="filters_modal">
            <h6 slot="header" class="modal-title" id="modal-title-default">Filters</h6>
            <div class="row">
              <base-checkbox class="mb-3" v-model="filter_form.asked_by_me">
                Asked by me
              </base-checkbox>
            </div>
            <v-select style="width: 100%;"
                      label="name"
                      :options="$store.state.courses"
                      v-model="filter_form.course"
                      placeholder="Course"></v-select>
            <br>
            <v-select style="width: 100%"
                      label="name"
                      :options="$store.state.tags"
                      v-model="filter_form.tag"
                      placeholder="Tag"
                      v-b-tooltip.hover.top
                      title="select a tag or start typing and press enter to add a tag."></v-select>
            <br>
            <div class="row">
              <base-button class="col" @click="clear_filters">Clear
                <font-awesome-icon icon="minus-circle"/>
              </base-button>
              <br>
              <base-button class="col" @click="apply_filters">Apply
                <font-awesome-icon icon="check"/>
              </base-button>
            </div>
          </modal>
        </div>
        <div class="col">
          <base-dropdown style="display: block" menuClasses="block-dropdown">
            <base-button block slot="title" type="secondary" class="dropdown-toggle">
              Order By: {{orderBy}}
            </base-button>
            <a class="dropdown-item" href="#" @click="change_sort('Votes')">Votes</a>
            <a class="dropdown-item" href="#" @click="change_sort('Views')">Views</a>
            <a class="dropdown-item" href="#" @click="change_sort('Date Asked')">Date Asked</a>
          </base-dropdown>
        </div>
      </div>
      <QuestionList class="row"
                    v-bind:filter-course="applied_filters.course"
                    v-bind:filter-asked-by-me="applied_filters.asked_by_me"
                    v-bind:filter-tag="applied_filters.tag"
                    v-bind:order-by="orderByOptions[orderBy]"
                    v-bind:the-watched="the_watched"
                    ref="qList"></QuestionList>
    </div>
  </section>
</template>
<script>
  import QuestionList from "../components/QuestionList";
  import BaseDropdown from "../../components/BaseDropdown";
  import BaseButton from "../../components/BaseButton";
  import Modal from "../../components/Modal";
  import BaseCheckbox from "../../components/BaseCheckbox";
  import BTooltip from "bootstrap-vue/es/directives/tooltip/tooltip";
  import BaseInput from "../../components/BaseInput";

  export default {
    name: "faq_index",
    components: {
      QuestionList,
      BaseDropdown,
      BaseButton,
      Modal,
      BaseCheckbox,
      BaseInput
    },
    directives: {
      BTooltip,
    },
    data() {
      return {
        filters_modal: false,
        filter_form: {
          asked_by_me: false,
          course: this.$route.params.course,
          tag: null
        },
        applied_filters: {
          asked_by_me: false,
          course: this.$route.params.course ? this.$route.params.course.id : null,
          tag: null
        },
        orderBy: 'Votes',
        orderByOptions: {
          'Votes': 'vote_count',
          'Views': 'view_count',
          'Date Asked': 'posted',
        },
        the_watched: 0
      }
    },
    mounted: function () {
      this.$store.dispatch('updateAvailableTagsAndCourses');
    },
    methods: {
      clear_filters: function () {
        this.filter_form.asked_by_me = false;
        this.filter_form.course = null;
        this.filter_form.tag = [];
        this.filters_modal = false;
        this.apply_filters();
      },
      apply_filters: function () {
        this.applied_filters.asked_by_me = this.filter_form.asked_by_me;
        this.applied_filters.course = this.filter_form.course ? this.filter_form.course.id : null;
        this.applied_filters.tag = this.filter_form.tag ? this.filter_form.tag.id : null;
        this.the_watched += 1;
        this.filters_modal = false;
      },
      change_sort: function (parameter) {
        this.orderBy = parameter;
        this.the_watched += 1;
      }
    }
  };
</script>
<style>
  .block-dropdown {
    min-width: 100% !important;
  }
</style>