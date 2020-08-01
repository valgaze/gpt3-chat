<template>
  <section
    class="nes-container with-title wrap"
    :class="{ 'is-dark': darkmode }"
    @click="componentTap"
  >
    <span class="title">{{ data.title }}</span>
    <div class="subtitle">{{ data.subtitle }}</div>
    <img
      class="card-image"
      v-if="image_url"
      :src="image_url"
      :alt="image_alttext"
    />
    <div
      class="text"
      v-if="data.formattedText"
      v-html="markdownify(data.formattedText)"
    ></div>
    <div
      class="text"
      v-else-if="data.text"
      v-html="markdownify(data.text)"
    ></div>
    <!-- Buttons -->
    <slot />
    <!---->
    <!---->
    <div class="footer">{{ data.footer }}</div>
  </section>
</template>

<script>
import showdown from "showdown";
export default {
  name: "card",
  mounted() {},

  data() {
    return {
      showdownRef: new showdown.Converter(),
    };
  },
  methods: {
    componentTap() {
      this.$emit("componentTap", {
        origin: "component",
        data: this.data.title,
      });
    },
  },
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
.wrap {
  margin-bottom: 1%;
}

section:hover {
  cursor: pointer;
}
</style>
