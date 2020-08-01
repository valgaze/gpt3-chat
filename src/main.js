import Vue from "vue";
import App from "./App.vue";
import VueTippy from "vue-tippy";

import chartXkcdVue from "chart.xkcd-vue";
Vue.use(chartXkcdVue);

import vmodal from "vue-js-modal";
Vue.use(vmodal);

Vue.use(VueTippy);
Vue.config.productionTip = false;

import "nes.css/css/nes.min.css";

import "typeface-press-start-2p/index.css";

new Vue({
  render: (h) => h(App),
}).$mount("#app");
