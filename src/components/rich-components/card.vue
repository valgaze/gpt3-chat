<template>
  <section class="nes-container with-title" :class="{ 'is-dark': darkmode }">
    <span class="title">{{ data.title }}</span>
    <div class="subtitle">{{ data.subtitle }}</div>
    <img
      class="card-image"
      v-if="image_url"
      :src="image_url"
      :alt="image_alttext"
    />
    <div
      style="text-align:left;"
      class="text"
      v-if="data.formattedText"
      v-html="markdownify(data.formattedText)"
    ></div>
    <div
      style="text-align:left;"
      class="text"
      v-else-if="data.text"
      v-html="markdownify(data.text)"
    ></div>
    <!-- Buttons -->
    <slot />
    <!---->
    <!---->
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

.card-wrap title {
  background: #212529 !important;
  color: #fff;
}
</style>
