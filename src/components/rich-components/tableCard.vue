<template>
  <section class="nes-container with-title" :class="{ 'is-dark': darkmode }">
    <table class="nes-table is-bordered" :class="{ 'is-dark': darkmode }">
      <thead>
        <tr>
          <th v-for="(header, idx) in data.columnProperties" :key="idx">
            {{ header.header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, ridx) in data.rows" :key="ridx">
          <td
            v-for="(item, iidx) in row.cells"
            :key="iidx"
            v-html="markdownify(item.text)"
          ></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import showdown from "showdown";
export default {
  name: "tablecard",
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
