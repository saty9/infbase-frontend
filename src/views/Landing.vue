<template>
  <div v-if="!$store.state.signedIn">
    <div class="position-relative" v-if="!$store.state.userId">
      <section class="section-shaped my-0">
        <div class="shape shape-style-3 shape-default shape-skew">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="container shape-container d-flex">
          <div class="col px-0">
            <div class="row">
              <div class="col-lg-6">
                <h1 class="display-3  text-white">
                  InfBase
                  <span
                    >A drop-in helpdesk for pre-honours Informatics students to
                    get additional tutoring and support with their
                    courses.</span
                  >
                </h1>
                <p class="lead  text-white">
                  In addition to supporting drop-in assistance, InfBase can be
                  used as a place to work together with other students, with
                  support from an InfBase tutor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="position-relative" :class="{ 'mt--300': !$store.state.userId }">
      <section class="section section-lg">
        <div class="container">
          <card class="border-0" shadow body-classes="py-2">
            <p class="lead text-muted">
              InfBase is in room 7.03 of Appleton tower
            </p>
            <session-schedule :scope="3" v-if="$store.state.userId" />
            <div v-else class="text-center my-5">
              <base-button type="primary" outline tag="a" href="/login"
                >Log in</base-button
              >
              to see the <b>schedule</b>.
            </div>
          </card>
        </div>
      </section>
    </div>
    <section class="section section-lg pt-lg-0">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12">
            <div class="row row-grid text-center">
              <div class="col" v-if="!$store.state.userId">
                <card class="border-0" hover shadow body-classes="py-5">
                  <div class="text-center">
                    <icon
                      name="ni ni-check-bold"
                      type="primary"
                      rounded
                      class="mb-4"
                    >
                    </icon>
                    <h6 class="text-primary text-uppercase">Schedule</h6>
                  </div>
                  <p class="description mt-3">
                    Just drop in into one of the sessions, you don’t have to
                    sign up in advance but committing regularly can help you
                    pacing your course work.
                  </p>
                  <base-button tag="a" href="#" type="primary" class="mt-4">
                    Learn more
                  </base-button>
                </card>
              </div>
              <div class="col">
                <card class="border-0" hover shadow body-classes="py-5">
                  <div class="text-center">
                    <icon
                      name="ni ni-istanbul"
                      type="success"
                      rounded
                      class="mb-4"
                    >
                    </icon>
                    <h6 class="text-success text-uppercase">FAQ</h6>
                  </div>
                  <p class="description mt-3">
                    To help InfBase tutors answering your questions, please let
                    them know in advance by posting a question.
                  </p>
                  <br />
                  <router-link to="faq" class="btn btn-success mt-4">
                    Learn more
                  </router-link>
                </card>
              </div>
              <div class="col">
                <card class="border-0" hover shadow body-classes="py-5">
                  <div class="text-center">
                    <icon
                      name="ni ni-planet"
                      type="warning"
                      rounded
                      class="mb-4"
                    >
                    </icon>
                    <h6 class="text-warning text-uppercase">Tutors</h6>
                  </div>
                  <p class="description mt-3">
                    InfBase tutors are selected on the basis of expertise and
                    coverage, offering support and advice on core pre-honours
                    courses in Informatics.
                  </p>
                  <base-button tag="a" href="#" type="warning" class="mt-4">
                    Learn more
                  </base-button>
                </card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-lg">
      <div class="container">
        <div class="row justify-content-center text-center mb-lg">
          <div class="col-lg-8">
            <h2 class="display-3">The amazing Team</h2>
          </div>
        </div>
        <div class="row" v-if="$store.state.userId">
          <tutor-info v-for="tutor in tutors" :tutor="tutor" :key="tutor.id"/>
        </div>
        <div v-else class="text-center">
          <base-button type="primary" tag="a" outline href="/login">Log in</base-button> to see the <b>tutors</b>.
        </div>
      </div>
    </section>
  </div>
  <div v-else class="container section">
    <div class="row">
      <div class="col-sm-4">
        <h5 class="text-center">InfBase</h5>
        A drop-in helpdesk for pre-honours Informatics students to get additional tutoring and support with their courses.

        <br/>In addition to supporting drop-in assistance, InfBase can be used as a place to work together with other students, with support from an InfBase tutor.
      </div>
      <div class="col">Place schedule here</div>
    </div>
    <br/>
    <div class="row">
      <div class="col-sm-4">
        <h5 class="text-center">Popular Course Questions</h5>
        <div v-for="course in $store.state.courses">
          <router-link :to="{ name: 'faq_index', params: { course: course }}" >{{course.name}}</router-link>
        </div>
      </div>
      <div class="col">
        <question-form></question-form>
      </div>
    </div>
  </div>
</template>

<script>
import SessionSchedule from "./admin/Schedule/Schedule";
import QuestionForm from "../components/FAQ/QuestionForm";
import TutorInfo from "@/views/components/TutorInfo";

export default {
  components: {
    SessionSchedule,
    TutorInfo,
    QuestionForm
  },
  data() {
    return {
      tutors: []
    };
  },
  mounted() {
    this.$store.dispatch('updateAvailableTagsAndCourses');
    
    this.axios
      .get("/api/admin/users", {
        headers: { Authorization: window.$cookies.get("jwt") },
        params: { roles: ["tutor"] }
      })
      .then(response => {
        this.tutors = response.data;
      })
  }
};
</script>
