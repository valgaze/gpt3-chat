<template>
  <section class="nes-container with-title" :class="{ 'is-dark': darkmode }">
    <span class="title">{{ data.title }}</span>
    <div class="graph-wrap">
      <slot :msg="msg" />
    </div>
  </section>
</template>

<script>
export default {
  name: "graphwrap",
  data() {
    return {
      chartdata: {},
    };
  },
  watch: {
    darkmode(newVal) {
      this.mixMode(newVal);
    },
  },
  methods: {
    mixMode(darkmode) {
      let payload = {};
      if (darkmode) {
        payload = {
          backgroundColor: "#000",
          strokeColor: "#fff",
        };
      } else {
        payload = {
          backgroundColor: "red",
          strokeColor: "#000",
        };
      }
      // we may need to think about overwriting the whole thing?
      // const newChartdata = Object.assign()
      // Tweak chartdata?
      const newPayload = {
        options: Object.assign(this.chartdata.options, payload),
      };
      this.chartdata = Object.assign(this.chartdata, newPayload);
    },
  },
  mounted() {
    this.chartdata = this.msg.content.chartdata;
  },
  props: {
    msg: {
      type: Object,
      default: () => {},
    },
    data: {
      type: Object,
      default: () => {
        return {
          content: {},
        };
      },
    },
    darkmode: Boolean,
  },
};
</script>
<style scoped>
.graph-wrap {
  transform: scale(0.95);
}
</style>
