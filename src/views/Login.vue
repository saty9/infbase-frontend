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
              <small>Sign in</small>
            </div>
            <base-alert type="danger" v-if="failure">
              {{response}}
            </base-alert>
            <form id="loginForm" role="form">
              <base-input
                alternative
                required
                class="mb-3"
                placeholder="Email"
                addon-left-icon="ni ni-email-83"
                v-model="email"
              >
              </base-input>
              <base-input
                alternative
                input_type="password"
                placeholder="Password"
                addon-left-icon="ni ni-lock-circle-open"
                v-model="password"
              >
              </base-input>
              <base-checkbox v-model="remember_me">
                Remember me
              </base-checkbox>
              <div class="text-center">
                <base-button
                  type="primary"
                  class="my-4"
                  v-on:click="submit()"
                >
                  Sign In
                </base-button>
              </div>
            </form>
          </card>
          <div class="row mt-3">
            <div class="col-6">
              <router-link to="/password" class="text-light">
                <small>Forgot password?</small>
              </router-link>
            </div>
            <div class="col-6 text-right">
              <router-link to="/signup" class="text-light">
                <small>Create new account</small>
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
        password: "",
        remember_me: false,
        failure: false,
        response: ""
      };
    },
    methods: {
      submit: function() {
        this.failure = false;

        this.axios
          .post("/api/login", {
            user: {
              email: this.email,
              password: this.password,
              remember_me: this.remember_me ? 1 : 0
            }
          })
          .then(response => {
            this.loginSuccessful(response)
          })
          .catch(error => this.loginFailed(error))
      },
      loginSuccessful (response) {
        this.$store.dispatch("signedIn", [
          response.headers.authorization,
          response.data.id,
          response.data.role
        ]);
        this.$store.commit("addAlert", ["You are now logged in.", "success"]);
        this.$router.push('/');
      },
      loginFailed (error) {
        this.failure = true;
        this.response = "Your email or password is incorrect";
      }
    }
  };
</script>

<style></style>
