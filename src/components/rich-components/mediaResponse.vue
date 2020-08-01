<template>
  <section class="nes-container with-title" :class="{ 'is-dark': darkmode }">
    <span class="title">{{ data.name }}</span>

    <img
      class="card-image"
      v-if="image_url"
      :src="image_url"
      :alt="image_alttext"
    />
    <p>{{ data.description }}</p>
    <audio :src="data.contentUrl" controls />
  </section>
</template>

<script>
import showdown from "showdown";
export default {
  name: "card",
  data() {
    return {
      showdownRef: new showdown.Converter(),
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
</style>
