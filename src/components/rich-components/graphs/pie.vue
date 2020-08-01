<template>
  <section class="nes-container with-title" :class="{ 'is-dark': darkmode }">
    <span class="title">{{ data.title }}</span>
    <!-- <rough-pie
      :data="tmpData"
      :title="data.title"
      :colors="['red', 'orange', 'blue', 'skyblue']"
      roughness="8"
    ></rough-pie> -->
    <chartxkcd-line :config="config"></chartxkcd-line>

    <!-- Buttons -->
    <slot />
    <!---->
    <!---->
  </section>
</template>

<script>
import showdown from "showdown";
import { chartXKCDLine } from "chart.xkcd-vue";

export default {
  name: "piechart",
  components: {
    "chartxkcd-line": chartXKCDLine,
  },
  data() {
    return {
      config: {
        title: "Monthly income of an indie developer",
        xLabel: "Month",
        yLabel: "$ Dollors",
        data: {
          labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          datasets: [
            {
              label: "Plan",
              data: [30, 70, 200, 300, 500, 800, 1500, 2900, 5000, 8000],
            },
            {
              label: "Reality",
              data: [0, 1, 30, 70, 80, 100, 50, 80, 40, 150],
            },
          ],
        },
      },
      showdownRef: new showdown.Converter(),
      tmpData: {
        labels: ["chocolate", "vanilla", "strawberry", "mint", "broccoli"],
        values: [0, 0, 0, 1, 2],
      },
    };
  },
  methods: {
    markdownify(input = "") {
      if (this.showdownRef) {
        return this.showdownRef.makeHtml(input);
      }
      return input;
    },
  },
  mounted() {
    alert(JSON.stringify(this.data.chartdata));
    // weird bug freezes :/
    this.tmpData = this.data.chartdata;
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          labels: ["North", "South", "East", "West"],
          values: [10, 5, 8, 3],
        };
      },
    },
    image_url: String,
    image_alttext: String,
    darkmode: Boolean,
  },
};
</script>

<style scoped>
.card-image {
  max-width: 50%;
  height: auto;
}

.card-wrap title {
  background: #212529 !important;
  color: #fff;
}
</style>
