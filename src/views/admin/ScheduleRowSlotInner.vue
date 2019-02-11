<template>
  <base-button outline class="btn-sm" type="secondary" @click="emitClick">{{tutor.last_name}}</base-button>
</template>
<script>
export default {
  props: {
    sesison: {
      type: Object,
      default: () => {},
      description: "The session object"
    },
    tutor: {
      type: Object,
      default: null,
      description: "An array of all tutors"
    }
  },
  data () {
    return {

    }
  },
  methods: {
    emitClick() {
      this.$emit('clicked');
    }
  }
}
</script>

