<template>
  <div
    @click="go"
    class="nes-balloon"
    :class="{
      darkmode: darkmode,
      shimmer: animate,
    }"
  >
    <h2>🚀</h2>
  </div>
</template>

<script>
// todo "live" update of animate prop change, stop animating or start animating
export default {
  name: "videogamize",
  mounted() {
    // if (this.animate) {
    //   this.animateFunc();
    // } else {
    //   this.active = this.msg;
    // }
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
    go() {
      if (this.target && this.target !== "#") {
        window.open(this.target, "_blank");
      }
    },
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
    target: {
      type: String,
      default: () => "#",
    },
    msg: {
      type: String,
      default: () => "DF-CHEATCODES",
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

<style scoped>
.shimmer {
  cursor: pointer;
  text-align: center;
  color: rgba(255, 255, 255, 0.1);
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    from(#222),
    to(#222),
    color-stop(0.5, #fff)
  );
  background: -moz-gradient(
    linear,
    left top,
    right top,
    from(#222),
    to(#222),
    color-stop(0.5, #fff)
  );
  background: gradient(
    linear,
    left top,
    right top,
    from(#222),
    to(#222),
    color-stop(0.5, #fff)
  );
  -webkit-background-size: 125px 100%;
  -moz-background-size: 125px 100%;
  background-size: 125px 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  background-clip: text;
  -webkit-animation-name: shimmer;
  -moz-animation-name: shimmer;
  animation-name: shimmer;
  animation-duration: 1.5s;
  animation-direction: alternate-reverse;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  background-repeat: no-repeat;
  background-position: 0 0;
  background-color: #222;
}

.darkmode {
  background: #000;
  color: #fefefe;
}
@-moz-keyframes shimmer {
  0% {
    background-position: top left;
  }
  100% {
    background-position: top right;
  }
}
@-webkit-keyframes shimmer {
  0% {
    background-position: top left;
  }
  100% {
    background-position: top right;
  }
}
@-o-keyframes shimmer {
  0% {
    background-position: top left;
  }
  100% {
    background-position: top right;
  }
}
@keyframes shimmer {
  0% {
    background-position: top left;
  }
  100% {
    background-position: top right;
  }
}
</style>
