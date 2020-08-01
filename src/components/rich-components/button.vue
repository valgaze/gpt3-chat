<template>
  <a :href="url" type="button" class="nes-btn is-primary" target="_blank">
    {{ title }}
  </a>
</template>

<script>
export default {
  data() {
    return {
      data: null,
    };
  },
  methods: {
    go(url) {
      if (url) {
        alert(url);
      }
    },
  },
  mounted() {},
  name: "cardbutton",
  props: {
    url: String,
    title: String,
    buttonStyle: Object,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
