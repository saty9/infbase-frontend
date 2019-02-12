<template>
  <base-button v-if="session" outline class="btn-sm" type="secondary" @click="emitClick">{{tutor.last_name}}</base-button>
  <base-button v-else-if="userRole=='admin'" type="secondary" class="btn-sm" @click="emitClick">+</base-button>
</template>
<script>
export default {
  props: {
    session_prop: {
      type: Object,
      default: null,
      description: "The session object"
    },
    tutor_prop: {
      type: Object,
      default: null,
      description: "An array of all tutors"
    }
  },
  data () {
    return {
      session: this.session_prop,
      tutor: this.tutor_prop,
      userRole: this.$store.state.userRole
    }
  },
  methods: {
    emitClick() {
      this.$emit('clicked');
    }
  },
  watch: {
    session_prop () {
      this.session = this.session_prop;
    },
    tutor_prop () {
      this.tutor = this.tutor_prop;
    }
  }
}
</script>

