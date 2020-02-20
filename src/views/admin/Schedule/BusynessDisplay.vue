<template>
  <div>
    <form>
      <label for="range">Average based on the last</label>
      <input id="range" type="number" v-model="range"> Months reports
      <input type="button" value="Update" @click="fetch_data">
    </form>
    <ul class="legend__list">
      <li style="list-style: none">
        <span class="badge" style="background: #8f9294">No Data</span>
      </li>
    </ul>
    <div id="chart" ref="chart"></div>
  </div>
</template>

<script>
  import * as d3 from "d3";

  export default {
    name: "BusynessDisplay",
    params: {
      first_day: String
    },
    data: function(){
      return {
        datasets: [[], []],
        draw_chart: function () {},
        range: 1,
        data_pattern: new RegExp("\\[(\\d), 2000-01-01 (\\d\\d?):00:00 UTC\\]")
      }
    },
    mounted: function () {
      this.fetch_data();
    },
    methods: {
      draw_data: function () {
        this.$refs.chart.innerHTML = "";
        var margin = {top: 50, right: 0, bottom: 100, left: 30},
          width = 960 - margin.left - margin.right,
          height = 430 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 16),
          legendElementWidth = gridSize * 2,
          buckets = 9,
          colors = ["#ffffff","#ffcccc", "#ff9999",
            "#ff6666", "#ff3333", "#ff0000",
            "#cc0000", "#990000", "#660000"], // alternatively colorbrewer.YlGnBu[9]
          days = ["Mo", "Tu", "We", "Th", "Fr"],
          times = ["9am", "10am", "11am", "12am", "1pm", "2pm", "3pm", "4pm", "5pm"];

        var svg = d3.select("#chart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var dayLabels = svg.selectAll(".dayLabel")
          .data(days)
          .enter().append("text")
          .text(function (d) {
            return d;
          })
          .attr("x", 0)
          .attr("y", function (d, i) {
            return i * gridSize;
          })
          .style("text-anchor", "end")
          .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
          .attr("class", function (d, i) {
            return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis");
          });

        var timeLabels = svg.selectAll(".timeLabel")
          .data(times)
          .enter().append("text")
          .text(function (d) {
            return d;
          })
          .attr("x", function (d, i) {
            return i * gridSize;
          })
          .attr("y", 0)
          .style("text-anchor", "middle")
          .attr("transform", "translate(" + gridSize / 2 + ", -6)")
          .attr("class", function (d, i) {
            return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis");
          });

        var heatmapChart = function (data) {
          var colorScale = d3.scaleQuantile()
            .domain([0, buckets - 1, 15])
            .range(colors);

          var cards = svg.selectAll(".hour")
            .data(data, function (d) {
              return d.day + ':' + d.hour;
            });

          cards.append("title");

          cards.enter().append("rect")
            .attr("x", function (d) {
              return (d.hour - 9) * gridSize;
            })
            .attr("y", function (d) {
              return (d.day - 1) * gridSize;
            })
            .style("fill", function (d) {
              if (d.value) {
                return colorScale(d.value);
              } else {
                return "#8f9294"
              }
            })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("class", "hour bordered")
            .attr("width", gridSize)
            .attr("height", gridSize);

          cards.select("title").text(function (d) {
            return d.value;
          });

          cards.exit().remove();

          var legend = svg.selectAll(".legend")
            .data([0].concat(colorScale.quantiles()), function (d) {
              return d;
            });

          legend.enter().append("g")
            .attr("class", "legend");

          legend.append("rect")
            .attr("x", function (d, i) {
              return legendElementWidth * i;
            })
            .attr("y", height)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function (d, i) {
              return colors[i];
            });

          legend.append("text")
            .attr("class", "mono")
            .text(function (d) {
              return "≥ " + Math.round(d);
            })
            .attr("x", function (d, i) {
              return legendElementWidth * i;
            })
            .attr("y", height + gridSize);

          legend.exit().remove();

        };

        heatmapChart(this.datasets[0]);
        heatmapChart(this.datasets[0]);
        this.draw_chart = heatmapChart
      },
      fetch_data: function () {
        let d = new Date();
        var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        let monday = new Date(d.setDate(diff));

        let v = this;
        this.axios.get("/api/teaching_sessions/history", {params: {range: this.range}}).then(function (response) {
          console.log(response);
          Object.keys(response.data).forEach(function(key) {
            let matches = key.match(v.data_pattern);
            var newkey = matches[1] + "-" + matches[2];
            response.data[newkey] = response.data[key];
            delete response.data[key];
          });
          v.datasets[0] = [];
          for (let x = 1; x <= 5; x++) {
            for (let y = 9; y <= 17; y++) {

              var current = response.data[x + "-" + y];
              if (current) {
                v.datasets[0].push({
                  day: x,
                  hour: y,
                  value: current
                });
              } else {
                v.datasets[0].push({
                  day: x,
                  hour: y,
                  value: null
                });
              }
            }
          }
          v.draw_data();
        })
      }
    }
  }
</script>

<style scoped>
  rect.bordered {
    stroke: #E6E6E6;
    stroke-width:2px;
  }

  text.mono {
    font-size: 9pt;
    font-family: Consolas, courier;
    fill: #aaa;
  }

  text.axis-workweek {
    fill: #000;
  }

  text.axis-worktime {
    fill: #000;
  }
</style>