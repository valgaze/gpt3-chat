<template>
  <section
    class="nes-container with-title carousel-wrap"
    :class="{ 'is-dark': darkmode }"
  >
    <slot />
  </section>
</template>

<script>
export default {
  name: "carouselSelect",
  data() {
    return {};
  },
  methods: {},
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
/*
todo: horizontal carousel
 .carousel-wrap {
  display: flex;
  overflow-x: scroll;
} */
</style>
