<template>
  <modal :show.sync="modal" @close="closeModal">
    <h6 slot="header" class="modal-title">Email {{ recipient }}</h6>

    <input
      placeholder="Email title"
      v-model="title"
      class="form-control mb-3"
    />

    <textarea
      class="form-control"
      id="exampleFormControlTextarea1"
      rows="3"
      placeholder="Email body"
      v-model="message"
    ></textarea>

    <template slot="footer">
      <base-button type="primary" @click="sendEmail">Send email</base-button>
      <base-button type="link" class="ml-auto" @click="closeModal"
        >Close
      </base-button>
    </template>
  </modal>
</template>

<script>
import Modal from "@/components/Modal";

export default {
  props: {
    modal: {
      type: [Boolean, String],
      default: false,
      description: "Is the modal opened?"
    },
    recipient: {
      type: String,
      default: "Tutors",
      description: "Whom to send the email?"
    }
  },
  components: {
    Modal
  },
  data() {
    return {
      errored: false,
      title: null,
      message: null,
      sent: false
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    sendEmail() {
      this.axios
        .post("/api/admin/users/send_email", {
          headers: { Authorization: window.$cookies.get("jwt") },
          title: this.title,
          message: this.message,
          recipient: this.recipient
        })
        .then(() => {
          this.$store.commit("ADD_ALERT", [
            "Email(s) sent successfully!",
            "success"
          ]);
          this.closeModal();
        })
        .catch(() => {
          this.errored = true;
        });
    },
    resetEmail() {
      this.errored = false;
      this.recipient = null;
      this.title = null;
      this.message = null;
    }
  }
};
</script>
