<template>
  <section class="message">
    <div
      class="nes-balloon"
      :class="{
        'is-dark': darkmode,
      }"
    >
      <p>{{ active }}</p>
    </div>
  </section>
</template>

<script>
// todo "live" update of animate prop change, stop animating or start animating
export default {
  name: "thinking",
  beforeDestroy() {
    if (this.ref) {
      clearInterval(this.ref);
    }
  },
  mounted() {
    if (this.animate) {
      this.animateFunc();
    } else {
      this.active = this.msg;
    }
  },
  data() {
    return {
      ref: null,
      active: "",
      pointer: 0,
      max: null,
      config: {
        tick: 1,
      },
    };
  },
  methods: {
    stop() {
      clearInterval(this.ref);
    },
    animateFunc() {
      if (!this.max) {
        this.max = this.msg.length;
      }
      this.ref = setInterval(() => {
        if (this.pointer >= this.max) {
          this.pointer = 0;
        }
        this.active = this.msg.substring(0, this.pointer + 1);
        this.pointer = this.pointer + 1;
      }, this.config.tick * 1000);
    },
  },
  watch: {
    animate: function(newVal) {
      if (newVal) {
        this.animateFunc();
      } else {
        this.stop();
        this.active = this.msg;
      }
    },
  },

  props: {
    msg: {
      type: String,
      default: () => "...",
    },
    darkmode: {
      type: Boolean,
      default: () => false,
    },
    animate: {
      type: Boolean,
      default: () => true,
    },
  },
};
</script>

<style scoped></style>
