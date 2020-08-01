<template>
  <div
    :class="{
      darkmode: darkmode,
    }"
    :style="{ width: '100%' }"
  >
    <card
      v-if="msg.type === 'basicCard'"
      :data="msg.content"
      :darkmode="darkmode"
      :debug="debug"
      :image_url="(msg.content.image && msg.content.image.url) || undefined"
      :image_alttext="
        (msg.content.image && msg.content.image.accessibilityText) || undefined
      "
    >
      <cardbutton
        v-for="(buttonRef, i) in msg.content.buttons"
        :key="i + '_button_'"
        :url="buttonRef.openUrlAction && buttonRef.openUrlAction.url"
        :title="buttonRef.title"
      />
    </card>

    <table-card
      v-if="msg.type === 'tableCard'"
      :data="msg.content"
      :darkmode="darkmode"
      :debug="debug"
    >
    </table-card>

    <!-- carouselBrowse is  different than carouselSelect -->
    <carousel :data="msg.content" v-if="msg.type === 'carouselBrowse'">
      <carouselcard
        @componentTap="handler"
        v-for="(item, index) in msg.content.items"
        :key="index"
        :data="{
          footer: item.footer,
          subtitle: item.description,
          title: item.title,
        }"
        :image_url="(item.image && item.image.url) || undefined"
        :image_alttext="
          (item.image && item.image.accessibilityText) || undefined
        "
        :darkmode="darkmode"
        :debug="debug"
      />
    </carousel>

    <carousel :data="msg.content" v-if="msg.type === 'carouselSelect'">
      <carousel_3d
        :disable3d="true"
        :space="365"
        :clickable="false"
        :controls-visible="true"
      >
        <carousel_3d_slide
          v-for="(item, index) in msg.content.items"
          :index="index"
          :key="index + 'arouselSelect__picker'"
        >
          <carouselcard
            @componentTap="handler"
            :key="index"
            :data="{ subtitle: item.description, title: item.title }"
            :image_url="(item.image && item.image.url) || undefined"
            :image_alttext="
              (item.image && item.image.accessibilityText) || undefined
            "
            :darkmode="darkmode"
            :debug="debug"
          />
        </carousel_3d_slide>
      </carousel_3d>
    </carousel>

    <!-- Picker: listSelect, here lazy version is a carousel implementation -->
    <carousel :data="msg.content" v-if="msg.type === 'listSelect'">
      <carouselcard
        @componentTap="handler"
        v-for="(item, index) in msg.content.items"
        :key="index"
        :data="{ subtitle: item.description, title: item.title }"
        :image_url="(item.image && item.image.url) || undefined"
        :image_alttext="
          (item.image && item.image.accessibilityText) || undefined
        "
        :darkmode="darkmode"
        :debug="debug"
      />
    </carousel>

    <div
      v-if="msg.type === 'youtube'"
      class="nes-container"
      :class="{ 'is-dark': darkmode }"
    >
      <youtube
        :darkmode="darkmode"
        :data="msg.content"
        :debug="debug"
      ></youtube>
    </div>

    <!-- Graphs & Charts -->
    <graphwrap
      key="something"
      v-if="_isGraph(msg.type)"
      :msg="msg"
      :darkmode="darkmode"
    >
      <template v-slot:default="obj">
        <chartxkcd-pie
          v-if="obj.msg.type === 'piechart'"
          :config="obj.msg.content.chartdata"
          :key="obj.msg.content.key"
        />
        <chartxkcd-line
          v-if="obj.msg.type === 'linechart'"
          :config="obj.msg.content.chartdata"
          :key="obj.msg.content.key"
        />
        <chartxkcd-bar
          v-if="obj.msg.type === 'barchart'"
          :config="obj.msg.content.chartdata"
          :key="obj.msg.content.key"
        />
        <chartxkcd-xy
          v-if="obj.msg.type === 'xychart'"
          :config="obj.msg.content.chartdata"
          :key="obj.msg.content.key"
        />
        <chartxkcd-radar
          v-if="obj.type === 'radarchart'"
          :config="obj.msg.content.chartdata"
          :key="obj.msg.content.key"
        />
      </template>
    </graphwrap>

    <div v-if="msg.type === 'mediaResponse'">
      <mediaResponse
        v-for="(item, index) in msg.content.mediaObjects"
        :key="index"
        :darkmode="darkmode"
        :debug="debug"
        :data="item"
        :image_url="(item.icon && item.icon.url) || undefined"
        :image_alttext="(item.icon && item.icon.accessibilityText) || undefined"
      >
      </mediaResponse>
    </div>

    <div class="debug-wrap" v-if="debug">
      <button
        type="button"
        @click="showDebug = !showDebug"
        class="nes-btn is-primary showcode"
      >
        {{ showDebug ? "] [" : "[]" }}
      </button>
      (<span class="nes-text is-error"
        >{{ !showDebug ? "show" : "hide" }} debug</span
      >)
      <textarea
        v-if="showDebug"
        id="debug_payload"
        class="nes-textarea"
        v-model="stringifiedPayload"
      >
      </textarea>
    </div>
  </div>
</template>

<script>
import { Carousel3d, Slide } from "vue-carousel-3d";

// Rich components, see here: https://gist.github.com/valgaze/dcd07f6d93f654de6d14d76a341d9450
import card from "./rich-components/card.vue";
import cardbutton from "./rich-components/button.vue";
import carousel from "./rich-components/carouselSelect.vue";
import carouselcard from "./rich-components/carouselCard.vue";
import mediaResponse from "./rich-components/mediaResponse.vue";
import tableCard from "./rich-components/tableCard.vue";

// Custom components
import youtube from "./rich-components/youtube.vue";
import graphwrap from "./rich-components/graphs/graph_wrap.vue";
import {
  chartXKCDLine,
  chartXKCDBar,
  chartXKCDXY,
  chartXKCDPie,
  chartXKCDRadar,
} from "chart.xkcd-vue";

/**
 * on backend:
 *
 * import {DFCheatConversation} from 'df-cheatcodes'
 * app.intent('blah blah intent', (conv: DFCheatConversation, parameters) => {
 *     conv.add(`Here's a video`)
 *     conv.cheat.addCustom("youtube", {
 *        text: "Jessica Triangle",
 *        url: `https://www.youtube.com/watch?v=YKIjXoiubzc`,
 *        autoplay: true,
 *      });
 *
 *
 * })
 */

export default {
  components: {
    carousel_3d: Carousel3d,
    carousel_3d_slide: Slide,
    "chartxkcd-line": chartXKCDLine,
    "chartxkcd-bar": chartXKCDBar,
    "chartxkcd-xy": chartXKCDXY,
    "chartxkcd-pie": chartXKCDPie,
    "chartxkcd-radar": chartXKCDRadar,
    card,
    cardbutton,
    carousel,
    carouselcard,
    graphwrap,
    mediaResponse,
    // pie,
    // scatter,
    tableCard,
    youtube,
  },
  name: "responsewrap",
  mounted() {
    this.stringifiedPayload = JSON.stringify(this.msg);
  },
  data() {
    return {
      stringifiedPayload: null,
      showDebug: false,
    };
  },
  methods: {
    _isGraph(candidate = "") {
      const roster = [
        `linechart`,
        `barchart`,
        `piechart`,
        `xychart`,
        `radarchart`,
        `stackedbarchar`,
      ];
      return roster.includes(candidate.toLowerCase());
    },
    handler(data) {
      this.$emit("handleTap", data);
    },
  },
  watch: {},
  props: {
    debug: {
      type: Boolean,
      default: () => false,
    },
    msg: {
      type: Object,
      default: () => {},
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
/*

  <component-wrap :message="msg" />

  [x] const textMsg = {
    type: 'text',
    content: 'aa bb cc'
  }

  [x] const card = {
    type: 'basicCard',
    content: {}
  }

  [x] const carouselSelect = {
    type: 'carouselSelect',
    content: {}
  }

  [x] const listSelect = {
    type: 'listSelect',
    content: {}
  }

  const mediaResponse = {
    type: 'mediaObject',
    content: {}
  }

*/
</script>

<style scoped>
#debug_payload {
  min-height: 8rem;
}

.debug-wrap {
  margin-bottom: 5%;
}

.carousel-3d-slide {
  background: #fff;
}
</style>
