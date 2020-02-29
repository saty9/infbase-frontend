<template>
  <thead>
    <tr class="row">
      <th class="col-1">
        <font-awesome-icon
          icon="caret-left"
          size="2x"
          @click="changeRange('prev')"
        />
      </th>
      <th
        class="col"
        v-for="date in calendar_range"
        :key="date.toDateString()"
      >
        {{ toFormattedDate(date) }}
      </th>
      <th class="col-1">
        <font-awesome-icon
          icon="caret-right"
          size="2x"
          @click="changeRange('next')"
        />
      </th>
    </tr>
  </thead>
</template>

<script>
export default {
  props: {
    scope: {
      type: Number,
      default: 3,
      description: "How many days to show at once"
    }
  },
  data() {
    return {
      today: new Date(),
      calendar_start: new Date(),
      calendar_scope: this.scope,
      calendar_range: null
    };
  },
  mounted() {
    this.changeRange();
  },
  methods: {
    toFormattedDate(date, format) {
      //date = new Date(Date.UTC(date[0], date[1] - 1, date[2]));
      let options = {
        weekday: "short",
        month: "short",
        day: "numeric"
      };

      if (format == "rails") {
        options["year"] = "numeric"
      } else if (date.toDateString() === (new Date).toDateString()){
        return "Today"
      }

      return date.toLocaleDateString("en-UK", options);
    },
    toArrayDate(date) {
      let year = date.getUTCFullYear();
      let month = date.getUTCMonth() + 1;
      let day = date.getUTCDate();

      return [year, month, day];
    },
    changeRange(direction) {
      let self = this;
      // change calendar start
      let d = this.calendar_start;
      if (direction == "prev")
        this.calendar_start.setDate(this.calendar_start.getDate() - this.calendar_scope);
      if (direction == "next")
        this.calendar_start.setDate(this.calendar_start.getDate() + this.calendar_scope);

      // Change the calendar range
      this.calendar_range = Array(this.calendar_scope)
        .fill(this.calendar_start)
        .map((x, idx) => {
          let ndate = new Date(this.calendar_start);
          ndate.setDate(ndate.getDate() + idx);
          return ndate
        });

      // Update parent
      this.$emit(
        "range",
        this.calendar_range,
        this.calendar_range.map(date => this.toFormattedDate(date, "rails"))
      );
    }
  },
  watch: {
    scope() {
      this.calendar_scope = this.scope;
      this.changeRange();
    }
  }
};
</script>

<style scoped lang="scss">
.bg-warning {
  color: white;
  border-radius: 50px;
}
tr th {
  border: 0px !important;

  svg { transition: all .1s ease-in-out; }
  svg:hover { transform: scale(1.3); }
}

thead tr th.bg-warning {
  border: 1px solid #fb6340 !important;
  color: #fb6340 !important;
  background-color: transparent !important;
}
</style>
