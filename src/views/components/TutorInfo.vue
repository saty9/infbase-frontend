<template>
  <div v-if="tutor" class="col-6 mb-4">
    <div class="text-center avatar-image mb-4">
      <img
        :src="tutor.avatar"
        class="rounded-circle shadow shadow-lg--hover"
        alt=""
      />
    </div>
    <h4 class="text-center">
      {{ tutor.first_name }}
    </h4>
    <div class="text-center text-muted mb-2">
      {{ tutor.biography }}
    </div>
    <div class="text-center">
      <badge type="success" v-for="(course, idx) in tutor.courses" :key="idx">
        {{ course }}
      </badge>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tutor: {
      type: Object,
      default: () => {},
      description: "Tutor object"
    }
  },
  data() {
    return {};
  }
};
</script>

<style>
.avatar-image img{
  height: 200px;
}
</style>
