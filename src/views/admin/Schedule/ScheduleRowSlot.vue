<template>
  <span v-bind:style="c_style">
    <base-button
      outline
      class="btn-sm"
      :type="session.tutor_id == $store.state.userId ? 'warning' : 'secondary'"
      v-if="session && (userRole == 'admin' || userRole == 'tutor')"
      @click="emitClick"
    >
      {{ session.tutor_f_name }}
    </base-button>
    <span v-else-if="session"
          class="course-button d-inline-block p-1"
          @click="emitClick"
    >
      <span v-if="session.courses.length">
        <badge type="secondary" v-for="(course, idx) in session.courses" :key="idx">
          {{ course }}
        </badge>
      </span>
      <badge v-else>
        NO COURSES SET
      </badge>
    </span>
    <base-button
      outline
      v-else-if="userRole == 'admin'"
      type="secondary"
      class="btn-sm"
      @click="emitClick"
      >+</base-button
    >
  </span>
</template>

<script>

  import BTooltip from "bootstrap-vue/es/directives/tooltip/tooltip";

  let busyness_map = {
    0: "#00BF02",
    1: "#25C401",
    2: "#4FCA02",
    3: "#7BD003",
    4: "#A8D504",
    5: "#D7DB05",
    6: "#E1B907",
    7: "#E69208",
    8: "#EC6909",
    9: "#F23F0B"
  };

export default {
  directives: {
    BTooltip
  },
  props: {
    hour: {
      type: Object,
      default: () => {},
      description: "Start time of the slot"
    },
    day: {
      type: Array,
      default: () => [],
      description: "Date of the slot"
    },
    session: {
      type: Object,
      default: null,
      description: "Object of the session at this slot"
    },
    forecast_basis: {
      type: String,
      description: "Which forecast dataset to display"
    }
  },
  methods: {
    emitClick() {
      this.$emit("clicked", this.session, this.day, this.hour);
    }
  },
  computed: {
    userRole: function() {
      return this.$store.state.userRole;
    },
    c_style: function() {
      let colour = "";
      if (this.session){
        colour = busyness_map[Math.min(this.session.forecast_busyness[this.forecast_basis], 9)]
      } else {
        colour = ""
      }
      return {
        "background-color": colour,
        "padding": "4px 4px 4px 4px"
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-body .dropdown {
  display: block;

  .dropdown-toggle::after {
    border: 0px !important;
  }
}
.course-button {
  transition: all 0.1s ease-in-out;
}
.course-button:hover {
  box-shadow: 0px 0px 10px -2px rgba(0, 0, 0, 0.75);
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}
.badge-success{
  background-color: rgba(147, 231, 195, 0.9);
}
.badge-default{
  background-color: rgba(52, 98, 175, 0.9);
}
.badge-secondary{
  background-color: rgba(255, 255, 255, 0.9);
}
.btn-outline-warning{
  background-color: whitesmoke;
}
</style>

