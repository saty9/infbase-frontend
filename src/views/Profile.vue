<template>
  <div class="container col-lg-6 col-xs-10 col-md-8 py-5">
    <card shadow class="card-profile mt-5">
      <h3>Profile</h3>
      <div
        class="text-center avatar-image"
        v-if="$store.state.userRole == 'tutor'"
      >
        <img
          :src="avatar"
          class="rounded-circle shadow shadow-lg--hover"
          alt=""
        />
        <div class="middle">
          <base-button type="secondary" @click="show = true"
            >Change avatar
          </base-button>
        </div>
      </div>
      <my-upload
        v-if="$store.state.userRole == 'tutor'"
        @crop-upload-success="cropUploadSuccess"
        v-model="show"
        :width="300"
        :height="300"
        :headers="header"
        url="/api/signup"
        method="put"
        field="user[avatar]"
        lang-type="en"
        img-format="png"
      >
      </my-upload>
      <br /><br />
      <base-input label="First name" v-model="first_name"></base-input>
      <base-input label="Last name" v-model="last_name"></base-input>
      <label for="biography">Biography</label>
      <textarea
        id="biography"
        class="form-control"
        cols="30"
        rows="10"
        label="Biography"
        v-model="biography"
      ></textarea>
      <base-button type="primary" class="float-right mt-3" @click="submit">
        Update
      </base-button>
    </card>
    <card v-if="$store.state.userRole == 'tutor'">
    <expertise-list/>
    </card>
  </div>
</template>
<script>
import myUpload from "vue-image-crop-upload";
import ExpertiseList from "./Expertise/ExpertiseList"

export default {
  components: {
    myUpload,
    ExpertiseList
  },
  data() {
    return {
      show: false,
      params: {
        token: "123456798",
        name: "avatar"
      },
      headers: {
        smail: "*_~"
      },
      user: { avatar: "" },
      first_name: "",
      last_name: "",
      biography: "",
      header: { Authorization: window.$cookies.get("jwt") }
    };
  },
  beforeMount() {
    this.avatar =
      "https://cdn.pixabay.com/photo/2018/09/06/18/26/person-3658927_1280.png";
    this.axios
      .get("/api/profile", {
        headers: { Authorization: window.$cookies.get("jwt") }
      })
      .then(response => {
        this.user = response.data;
        this.first_name = this.user.first_name;
        this.last_name = this.user.last_name;
        this.biography = this.user.biography;
        this.avatar = this.user.avatar;
      })
      .catch(() => {
        this.errored = true;
      })
      .finally(() => (this.loading = false));
  },
  methods: {
    submit() {
      this.axios
        .put("/api/signup", {
          headers: { Authorization: window.$cookies.get("jwt") },
          user: {
            first_name: this.first_name,
            last_name: this.last_name,
            biography: this.biography
          }
        })
        .then(response => {
          this.user = response.data;
          this.$store.commit("ADD_ALERT", [
            "Your account was successfully updated!",
            "success"
          ]);
        })
        .catch(() => {
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    },
    cropUploadSuccess(jsonData, field) {
      this.show = false;
      this.avatar = jsonData.avatar;
      this.$store.commit("ADD_ALERT", [
        "Avatar updated successfully!!",
        "success"
      ]);
    }
  }
};
</script>

<style lang="scss" scoped>
.avatar-image {
  position: relative;
  .middle {
    transition: 0.5s ease;
    opacity: 0.3;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    text-align: center;
  }
  img {
    max-height: 300px;
    opacity: 1;
    transition: 0.5s ease;
    backface-visibility: hidden;
  }
}
.avatar-image:hover {
  img {
    opacity: 0.3;
  }
  .middle {
    opacity: 1;
  }
}
</style>