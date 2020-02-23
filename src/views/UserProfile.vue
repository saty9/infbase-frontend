<template>
  <div class="container col-lg-6 col-xs-10 col-md-8 py-5">
    <card shadow class="card-profile mt-5">
      <h3>Profile</h3>
      <div
        class="text-center avatar-image"
        v-if="avatar"
      >
        <img
          :src="avatar"
          class="rounded-circle shadow shadow-lg--hover"
          alt=""
        />
      </div>
      <br /><br />
      <base-input label="First name" v-model="first_name" disabled></base-input>
      <base-input label="Last name" v-model="last_name" disabled></base-input>
      <label for="biography">Biography</label>
      <textarea
        id="biography"
        class="form-control"
        cols="30"
        rows="10"
        label="Biography"
        v-model="biography"
        disabled
      ></textarea>
      <br/>
      <Schedule v-bind:filter_id="user.id" v-if="user.role='tutor'" id="schedule"></Schedule>
    </card>
  </div>
</template>
<script>
import myUpload from "vue-image-crop-upload";
import ExpertiseList from "./Expertise/ExpertiseList"
import Schedule from "./admin/Schedule/Schedule";

export default {
  components: {
    Schedule,
    myUpload,
    ExpertiseList
  },
  data() {
    return {
      show: false,
      headers: {
        smail: "*_~"
      },
      user: { avatar: "" },
      first_name: "",
      last_name: "",
      biography: "",
      avatar: "",
    };
  },
  beforeMount() {
    this.axios
      .get("/api/profile/" + this.$route.params.id,)
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
  mounted: function()
  {
    // From testing, without a brief timeout, it won't work.
    setTimeout(() => this.scrollFix(this.$route.hash), 1);
  },
  methods: {
    scrollFix: function(hashbang)
    {
      location.hash = hashbang;
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