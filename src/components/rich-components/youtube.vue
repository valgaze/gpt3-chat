<template>
  <div class="nes-container with-title wrap" :class="{ 'is-dark': darkmode }">
    <h3 class="title" v-html="data.text"></h3>

    <iframe
      v-if="embedURL"
      width="100%"
      height="100%"
      :src="embedURL"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      class="youtube-embed"
    ></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      embedURL: null,
    };
  },
  methods: {
    timestampParser(timestamp = "") {
      // ex. 1m15s >> 75
      const normalized = String(timestamp).toLowerCase();
      let result = timestamp;
      if (normalized.includes("m") || normalized.includes("s")) {
        let [m, s] = normalized.split("m");
        result = Number(m) * 60;
        s = s.split("s")[0];
        result += Number(s);
      }
      return result;
    },
    setEmbed(url) {
      let id = url;
      /**
       * Embed is different from url
       * https://www.youtube.com/watch?v=MuqClmxp_Ng
       * https://youtu.be/MuqClmxp_Ng
       *
       */
      if (url.includes(`watch?v=`)) {
        // variant 1
        id = url.split("?v=")[1];
      }
      if (url.includes(`youtu.be`)) {
        // variant 2
        id = url.split("/")[3];
      }

      // const key = url;
      // get youtube code
      this.embedURL = `https://www.youtube.com/embed/${id}`;
      const flags = [];
      if (this.data.autoplay) {
        flags.push(`autoplay=1`);
      }
      if (this.data.start) {
        flags.push(`start=${this.timestampParser(this.data.start)}`);
      }
      if (this.data.end) {
        flags.push(`end=${this.timestampParser(this.data.end)}`);
      }
      if (flags.length) {
        flags.push("cc_load_policy=1");
        this.embedURL = `${this.embedURL}?${flags.join("&")}`;
      }
    },
  },
  mounted() {
    this.setEmbed(this.data.url);
  },
  name: "videowrap",
  props: ["data", "darkmode"],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.youtube-embed {
  min-height: 20rem;
}
.wrap {
  /**
 * HACK
 * Embed can mess w/ container and float away
 * Enforce relative positioning on parent
 */
  position: relative !important;
}
</style>
