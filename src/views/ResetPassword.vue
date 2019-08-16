<template>
  <section class="section section-shaped section-lg my-0">
    <div class="shape shape-style-1 bg-gradient-default">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="container pt-lg-md">
      <div class="row justify-content-center">
        <div class="col-lg-5">
          <card
            type="secondary"
            shadow
            header-classes="bg-white pb-5"
            body-classes="px-lg-5 py-lg-5"
            class="border-0"
          >
            <div class="text-center text-muted mb-3">
              <small>Reset password</small>
            </div>
            <base-alert
              type="success"
              v-if="success"
            >
              {{response}}
            </base-alert>
            <base-alert
              type="warning"
              v-if="failure"
            >
              {{response}}
            </base-alert>
            <form
              id="loginForm"
              role="form"
            >
              <base-input
                alternative
                required
                class="mb-3"
                placeholder="Email"
                addon-left-icon="ni ni-email-83"
                v-model="email"
              >
              </base-input>
              <div class="text-center">
                <base-button
                  type="primary"
                  class="my-4"
                  :class="{disabled: success}"
                  v-on:click="submit()"
                >
                  Send a link to reset password
                </base-button>
              </div>
            </form>
          </card>
          <div class="row mt-3">
            <div class="col-6">
              <router-link
                to="/login"
                class="text-light"
              >
                <small>Log in</small>
              </router-link>
            </div>
            <div class="col-6 text-right">
              <router-link
                to="/register"
                class="text-light"
              >
                <small>Register</small>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      response: "",
      success: false,
      failure: false
    };
  },
  methods: {
    validEmail: function(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(this.email);
    },
    submit: function() {
      this.response = "";
      this.failure = false;
      this.success = false;

      if (!this.validEmail()) {
        this.resetFailed("Please, use a real email.");
        return;
      }

      this.axios
        .post("/api/password", {
          user: {
            email: this.email
          }
        })
        .then(response => this.resetSuccessful(response))
        .catch(error => this.resetFailed(error));
    },
    resetSuccessful(response) {
      this.success = true;
      this.response = response.data.message;
    },
    resetFailed(error) {
      this.failure = true;
      this.response = error;
    }
  }
};
</script>

<style>
</style>