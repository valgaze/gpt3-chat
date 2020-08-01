<template>
  <section class="nes-container with-title" :class="{ 'is-dark': darkmode }">
    <span class="title">{{ data.title }}</span>
    <!-- <rough-bar
      labels="flavor"
      values="price"
      :data="{ labels: ['a', 'b'], values: [10, 20] }"
    ></rough-bar> -->
    {{ data }}
    <!-- Buttons -->
    <slot />
    <!---->
    <!---->
  </section>
</template>

<script>
import showdown from "showdown";
// import { RoughBar } from "vue-roughviz";

export default {
  name: "barchart",
  components: {
    // RoughBar,
  },
  data() {
    return {
      showdownRef: new showdown.Converter(),
      tmpData: [
        {
          flavor: "vanilla",
          price: 2,
        },
        {
          flavor: "chocolate",
          price: 3,
        },
        {
          flavor: "swirl",
          price: 4,
        },
        {
          flavor: "hazelnut",
          price: 5,
        },
        {
          flavor: "coffee",
          price: 5,
        },
        {
          flavor: "lemon",
          price: 3,
        },
        {
          flavor: "special",
          price: 3,
        },
      ],
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
  mounted() {},
  props: {
    data: Object,
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
