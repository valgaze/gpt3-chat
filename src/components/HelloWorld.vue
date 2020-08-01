<template>
  <div class="hello">
    <h3 :class="{ 'heading-darkmode': darkmode }">Handy Links</h3>
    <ul>
      <li>
        <a
          href="https://github.com/valgaze/gpt3rockte"
          target="_blank"
          rel="noopener"
          >gpt3rocket</a
        >
      </li>
      <li>
        <a
          href="https://github.com/valgaze/df-starter-kit"
          target="_blank"
          rel="noopener"
          >df-starter-kit</a
        >
      </li>
      <li>
        <a
          href="https://github.com/valgaze/df-frontend-vue"
          target="_blank"
          rel="noopener"
          >df-cheatchat (this thing)</a
        >
      </li>

      <li>
        <a
          href="https://github.com/valgaze/dialogflow-speedrun"
          target="_blank"
          rel="noopener"
          >DialogFlow "Speedrun"</a
        >
      </li>
      <li>
        <a
          href="https://github.com/valgaze/df-starter-kit/blob/master/docs/glossary.md"
          target="_blank"
          rel="noopener"
          >Glossary</a
        >
      </li>
      <li>
        <a
          href="https://github.com/valgaze/df-starter-kit/blob/master/docs/resources.md"
          target="_blank"
          rel="noopener"
          >Learning Resources</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
    darkmode: Boolean,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
.heading-darkmode {
  color: #f1c40f;
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
