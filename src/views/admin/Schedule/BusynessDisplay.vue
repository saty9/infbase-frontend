<template>
  <div>
    <div id="chart"></div>
    <div id="dataset-picker">
      <input type="button" @click="draw_chart(datasets[0])" value="previous attendance">
      <input type="button" @click="draw_chart(datasets[1])" value="students interested">
    </div>
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
        draw_chart: function () {}
      }
    },
    mounted: function () {
      this.fetch_data();
    },
    methods: {
      draw_data: function () {
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
            .domain([0, buckets - 1, d3.max(data, function (d) {
              return d.value;
            })])
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
              return colorScale(d.value);
            })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("class", "hour bordered")
            .attr("width", gridSize)
            .attr("height", gridSize);

          cards.style("fill", function (d) {
              return colorScale(d.value);
            });

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

        heatmapChart(this.datasets[1]);
        heatmapChart(this.datasets[1]);
        this.draw_chart = heatmapChart

        /*var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
          .data(this.datasets);

        datasetpicker.enter()
          .append("input")
          .attr("value", function (d) {
            return "Dataset " + d
          })
          .attr("type", "button")
          .attr("class", "dataset-button")
          .on("click", function (d) {
            heatmapChart(d);
          });
         */

      },
      fetch_data: function () {
        let d = new Date();
        var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        let monday = new Date(d.setDate(diff));

        let v = this;
        this.axios.get("/api/teaching_sessions/forecast", {params: {first_day: monday}}).then(function (response) {
          console.log(response);
          for (let x = 1; x <= 5; x++) {
            for (let y = 9; y <= 17; y++) {
              var current = response.data.find(function (e) {
                let dow = new Date(monday);
                dow.setDate(dow.getDate() + x - 1);
                return e.start_hour == y && (new Date(e.start_date)).getDate() == dow.getDate();
              });
              if (current) {
                v.datasets[0].push({
                  day: x,
                  hour: y,
                  value: current.forecast_busyness.previous_session_attendance
                });
                v.datasets[1].push({
                  day: x,
                  hour: y,
                  value: current.forecast_busyness.interest
                })
              } else {
                v.datasets[0].push({
                  day: x,
                  hour: y,
                  value: 0
                });
                v.datasets[1].push({
                  day: x,
                  hour: y,
                  value: 0
                })

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