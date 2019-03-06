<template>
  <div>
    <div class="position-relative">
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
                <h1 class="display-3 text-white">
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
    <div class="position-relative mt--300">
      <section class="section section-lg">
        <div class="container">
          <card class="border-0" shadow body-classes="py-2">
            <prototype slot="header" class="row">
              <p class="text-muted col-lg-4 col-xs-12">
                <span class="badge mr-3 badge-success badge-circle">
                  <i class="fa fa-map-marker-alt"></i>
                </span>
                room 7.03 of Appleton tower
              </p>
              <p class="text-muted col-lg-8 col-xs-12 text-right">
                <span class="badge mr-3 badge-primary badge-circle">
                  <i class="fa fa-info"></i>
                </span>
                Drop in into one of the sessions below. You don’t have to sign up
                in advance.
              </p>
            </prototype>
            <session-schedule
              :scope="3"
              v-if="$store.state.userId"
              class="py-2"
            />
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

    <div class="position-relative">
      <section class="section section-lg bg-secondary">
        <div class="container">
          <div class="row justify-content-center text-center mb-lg">
            <div class="col-lg-8">
              <h2 class="display-3">FAQ</h2>
            </div>
          </div>
          <div class="row p-0 col-12">
            <div class="col-sm-4">
              <h4 class="text-primary">Popular Course Questions</h4>
              <div v-for="course in $store.state.courses" :key="course.id">
                <router-link
                  class="btn btn-outline-primary col-xs-12 d-block mb-2"
                  :to="{ name: 'faq_index', params: { course: course } }"
                  >{{ course.name }}</router-link
                >
              </div>
            </div>
            <card shadow class=" col py-2">
              <question-form></question-form>
            </card>
          </div>
        </div>
      </section>
    </div>

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
          <base-button type="primary" tag="a" outline href="/login"
            >Log in</base-button
          >
          to see the <b>tutors</b>.
        </div>
      </div>
    </section>
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
    this.$store.dispatch("updateAvailableTagsAndCourses");
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
