<template>
  <div id="app">
    <div ref="headerRef">
      <a href="https://github.com/valgaze/gpt3-chat" target="_blank"
        ><h2>GPT3Chat</h2></a
      >

      <a href="https://github.com/valgaze/gpt3rocket" target="_blank"
        ><h2>GPT3Rocket🚀</h2></a
      >
    </div>

    <section
      class="nes-container"
      :class="{ 'is-dark': darkmode }"
      style="border-width: 0;"
    >
      <section class="message-list" :style="myStyles">
        <section
          v-for="(msg, idx) in messages"
          :key="idx"
          class="message"
          :class="{
            '-left': msg.author === 'agent',
            '-right': msg.author === 'me',
          }"
        >
          <div
            style="display: flex;flex-direction: column;justify-content: flex-end;"
          >
            <i
              class="nes-octocat"
              :class="{ animate: animate, darkcat: darkmode }"
              v-if="
                msg.author === 'agent' && showcharacters && msg.type === 'text'
              "
            ></i>
          </div>
          <!-- Balloon -->

          <div
            v-if="msg.type === 'text'"
            class="nes-balloon"
            :class="{
              'from-left': msg.author === 'agent',
              'from-right': msg.author === 'me',
              'is-dark': darkmode,
            }"
          >
            <p>{{ msg.content }}</p>
          </div>

          <responsewrap
            @handleTap="tapHandler"
            :msg="msg"
            :darkmode="darkmode"
            :debug="debugMode"
            v-else
            :class="{
              'is-dark': darkmode,
            }"
          />

          <div>
            <i
              class="nes-bcrikko"
              v-if="msg.author === 'me' && showcharacters"
            ></i>
          </div>
        </section>

        <thinkingcomponent
          v-if="thinking"
          :darkmode="darkmode"
          :animate="animate"
        ></thinkingcomponent>

        <!-- Rich components, add support to render payloads here -->
        <section class="message -right" v-if="false">
          <card></card>
          <!--
              card
              suggestion
              carousel
              listSelect
              carouselBrowse
              mediaObject
              linkoutSuggestion
              iframer
              video
              mindreader
            --->
        </section>
      </section>
    </section>
    <!-- <div class="nes-field fixed--suggestions"> -->
    <div class="wrap" ref="footerRef">
      <div class="suggestions">
        <!-- <a
          v-for="(suggestion, idx) in suggestions"
          :key="idx"
          class="nes-badge"
          @click="suggest($event, suggestion)"
        > -->
        <button
          v-if="linkoutSuggestion && linkoutSuggestion.url"
          :href="linkoutSuggestion.url"
          target="_blank"
          class="nes-text is-primary"
          @click="_openLinkout(linkoutSuggestion.url)"
        >
          {{ linkoutSuggestion.destinationName }}
        </button>

        <button
          v-for="(suggestion, idx) in permanentSuggestions"
          :key="idx + '_permanent'"
          @click="suggest(suggestion)"
        >
          {{ suggestion }}
        </button>
        <button
          v-for="(suggestion, idx) in suggestions"
          :key="idx"
          @click="suggest(suggestion)"
        >
          {{ suggestion }}
        </button>
        <!-- <i class="nes-btn">{{ suggestion }}</i> -->
      </div>

      <div class="nes-field is-inline" :class="{ 'is-dark': darkmode }">
        <input
          type="text"
          id="chat__input"
          class="nes-input"
          placeholder="Enter your message"
          v-model="usermsg"
          ref="userinput"
          v-on:keyup.13="send(usermsg)"
          v-on:keyup.38="cycler('up')"
          v-on:keyup.40="cycler('down')"
        />
        <button @click="send(usermsg)" type="button" class="nes-btn is-primary">
          SEND
        </button>
        <button
          class="nes-btn is-primary"
          @click="rowActive = !rowActive"
          type="button"
          :content="
            rowActive ? 'Tap to collapse' : 'Tap to expand other config'
          "
          v-tippy="{ arrow: true, animation: 'scale' }"
        >
          {{ rowActive ? "] [" : "[]" }}
        </button>
        <button
          v-if="rowActive"
          type="button"
          class="nes-btn is-warning"
          @click="$modal.show('settings-modal')"
          content="Settings for client (backend, darkmode, animation, etc)"
          v-tippy="{ arrow: true, animation: 'scale' }"
        >
          Settings
        </button>

        <button
          v-if="rowActive"
          type="button"
          class="nes-btn is-warning"
          @click="$modal.show('primer-modal')"
          content="Adjust API parameters, change personas, edit question/answer samples & priming phrases"
          v-tippy="{ arrow: true, animation: 'scale' }"
        >
          Personas/Primers
        </button>
      </div>
    </div>

    <!--- Modal --->
    <!-- <vodal
      :closeButton="false"
      :className="modalClass"
      :closeOnEsc="true"
      :customStyles="modalStyle"
      :show="settingsActive"
      :animation="modalAnimation"
      @hide="settingsActive = false"
    > -->

    <modal
      name="settings-modal"
      :adaptive="true"
      :draggable="true"
      :resizable="true"
      transition="scale"
      width="80%"
      height="60%"
    >
      <div
        class="hacky__close"
        :class="{ 'is-dark': darkmode }"
        @click="$modal.hide('settings-modal')"
      >
        <i class="nes-icon close is-small"></i>
      </div>
      <div
        class="nes-dialog"
        id="dialog-default"
        :class="{ 'is-dark': darkmode }"
      >
        <form
          method="dialog"
          class="settings nes-container with-title"
          :class="{ 'is-dark': darkmode }"
        >
          <h3 class="title">Settings</h3>

          <div>
            Dark mode
            <label>
              <input
                type="radio"
                class="nes-radio"
                name="answer"
                v-model="darkmode"
                :value="true"
                :class="{ 'is-dark': darkmode }"
              />
              <span>Yes</span>
            </label>

            <label>
              <input
                type="radio"
                class="nes-radio"
                v-model="darkmode"
                :value="false"
                name="answer"
                :class="{ 'is-dark': darkmode }"
              />
              <span>No</span>
            </label>
          </div>

          <label>
            <input
              type="checkbox"
              class="nes-checkbox"
              :class="{ 'is-dark': darkmode }"
              v-model="showcharacters"
            />
            <span>Show Avatars in Chat </span>
          </label>
          <label>
            <input
              type="checkbox"
              class="nes-checkbox"
              :class="{ 'is-dark': darkmode }"
              v-model="animate"
            />
            <span>Animate/Shimmer</span>
          </label>
          <label>
            <input
              type="checkbox"
              class="nes-checkbox"
              :class="{ 'is-dark': darkmode }"
              v-model="scrollToBottom"
            />
            <span>Scroll to bottom</span>
          </label>

          <!-- <label>
            <input
              type="checkbox"
              class="nes-checkbox"
              :class="{ 'is-dark': darkmode }"
              v-model="debugMode"
            />
            <span>Debug</span>
          </label> -->

          <div class="nes-field is-inline">
            <label for="inline_field">Backend</label>
            <input
              type="text"
              class="nes-input"
              placeholder="http://locahost:8000/chat"
              v-model="backend"
            />
          </div>
          <menu class="dialog-menu">
            <button @click="saveSettings" class="nes-btn is-primary">
              Save
            </button>
            <button @click="saveDefaults" class="nes-btn is-primary">
              Reset Default
            </button>
            <button @click="suggestions = []" class="nes-btn is-primary">
              Clear Suggestions
            </button>
          </menu>
        </form>
      </div>
    </modal>

    <!-- <vodal
      :closeButton="false"
      :className="modalClass"
      :closeOnEsc="true"
      :customStyles="modalStyle"
      :show="requestActive"
      :animation="modalAnimation"
      @hide="requestActive = false"
    > -->

    <modal
      name="primer-modal"
      :adaptive="true"
      :draggable="true"
      :resizable="true"
      width="80%"
      height="85%"
    >
      <div
        class="hacky__close"
        :class="{ 'is-dark': darkmode }"
        @click="$modal.hide('primer-modal')"
      >
        <i class="nes-icon close is-small"></i>
      </div>
      <request
        :defaultAPIFlags="defaultAPIFlags"
        :personaKey="personaKey"
        :activePersona="activePersona"
        :personas="personas"
        @importPersonas="importPersonas"
        @updateAPIConfig="updateAPIConfig"
        @updatePersona="updatePersona"
        @removeSample="removeSample"
        @addSample="addSample"
        @editSample="editSample"
        :client="client"
        :requestActive="requestActive"
        :grpc="grpc"
        :darkmode="darkmode"
        :animate="animate"
        :defaultSession="session"
        @boom="requestHandler"
      ></request>
    </modal>
  </div>
</template>

<script>
import Vue from "vue";
import { ClientHelper } from "./ClientHelper";

import card from "./components/rich-components/card.vue";
import thinking from "./components/rich-components/thinking.vue";
import request from "./components/request.vue";
import responsewrap from "./components/response_wrap.vue";
import personas from "./personas";
const config = {
  backend: process.env.VUE_APP_BACKEND,
};
const client = new ClientHelper(config);

export default {
  name: "App",
  components: {
    card,
    Thinkingcomponent: thinking,
    request,
    responsewrap,
  },
  destroyed() {
    window.removeEventListener("resize", this.setHeights);
  },
  mounted() {
    // this.$modal.show("primer-modal");
    this.activePersona = this.personas[this.personaKey];
    if (this.loadSettings && this.loadSettingsFromStorage) {
      this.loadSettings();
    }
    this.setHeights();
    window.addEventListener("resize", this.setHeights);
    // set focus on chat
    this.$refs.userinput.focus();

    // handle overrides/flags
    this.grabFlags();

    // session
    this.session = this.client.buildSession();

    if (this.triggerShortcut) {
      // handle shortcutparse
      // Put it back together de-humpty dumpy
      // dispatch it w/ this.send
      try {
        const rooty = JSON.parse(this.triggerShortcut);
        const { command } = rooty;
        if (command) {
          const cheatString = `${command}`;
          this.send(cheatString);
        }
      } catch (e) {
        this.__debug("<catastrophic error:triggershort> url", e);
      }
    }
    // 1st render on mobile safari
    this.$nextTick(() => {
      this._scrollDown();
    });
  },
  data() {
    return {
      defaultAPIFlags: {
        max_tokens: 20,
        temperature: 0.3,
        stop: "\n",
      },
      personaKey: "default",
      personas: personas,
      activePersona: {},
      // @fregante via: https://stackoverflow.com/a/23522755/3191929
      isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
      pos: 0,
      userEntries: [
        `what do you do for fun?`,
        `What's the most interesting fact in the world?`,
        `what's the biggest room in the universe`,
      ],
      transformgrpc: true,
      rootHeight: 0,
      headerHeight: 0,
      footerHeight: 0,
      greeting: ``,
      rowActive: false,
      modalStyle: {
        height: "100%",
        width: "100%",
      },
      codeActive: false,
      settingsActive: false,
      requestActive: false,
      usermsg: "",
      client: client,
      session: "",
      loadSettingsFromStorage: true,
      storageKey: `__STORAGE`,
      thinking: false,
      grpc: true,
      darkmode: false,
      animate: true,
      showcharacters: true,
      backend: config.backend,
      debugMode: false,
      scrollToBottom: true,
      triggerMessage: "",
      triggerShortcut: "",
      suggestions: [],
      permanentSuggestions: [],
      // permanentSuggestions: ["$help"],
      linkoutSuggestion: {},
      messages: [
        { author: "me", content: "Hello?", type: "text" },
        { author: "agent", content: "Hi there", type: "text" },
      ],
    };
  },

  watch: {
    backend: {
      immediate: true,
      handler: function(val) {
        this.client.updateBackend(val);
      },
    },
    grpc() {
      // this.client.updateTransformgrpc(this.grpc);
    },
    darkmode(newVal) {
      const bodyRef = document.querySelector("body");
      if (newVal) {
        bodyRef.classList.add("darkmode");
      } else {
        bodyRef.classList.remove("darkmode");
      }
    },
  },
  computed: {
    chatHeight() {
      return this.footerHeight;
    },
    myStyles() {
      return {
        paddingBottom: `${this.chatHeight}px`,
      };
    },
    modalAnimation() {
      return this.animate ? "door" : "na";
    },
    modalClass() {
      return this.darkmode ? "darkmode" : "lightmode";
    },
  },
  methods: {
    importPersonas(payload) {
      if (payload.personas) {
        const merge = Object.assign(this.personas, payload.personas);
        Vue.set(this, "personas", merge);
        console.log("#", this.personas);
      }
    },
    updateAPIConfig(payload) {
      Vue.set(this.activePersona, "APIFlags", payload.APIFlags);
    },
    updatePersona(payload) {
      const { personaKey } = payload;
      this.personaKey = personaKey;
      this.activePersona = this.personas[this.personaKey];
    },
    removeSample({ index }) {
      this.activePersona.samples.splice(index, 1);
    },
    editSample({ sample, index }) {
      this.activePersona.samples.splice(index, 1, sample);
    },
    addSample({ sample }) {
      this.activePersona.samples.push(sample);
    },
    updateUserEntries(entry) {
      if (this.userEntries[this.userEntries.length - 1] !== entry) {
        this.userEntries.push(entry);
        this.pos = this.userEntries.length;
      }
    },
    cycler(direction) {
      const entries = this.userEntries;
      const length = entries.length;
      const end = length - 1;
      const start = 0;
      if (direction === "up") {
        if (this.pos === 0) {
          this.pos = end;
        } else {
          this.pos = this.pos - 1;
        }
      }
      if (direction === "down") {
        this.pos = this.pos + 1;
        if (this.pos > length) {
          this.pos = start;
        }
      }
      if (length) {
        this.usermsg = this.userEntries[this.pos];
      }
    },
    _openLinkout(url) {
      if (url) {
        window.open(url, "_blank");
        this.linkoutSuggestion = {};
      }
    },
    tapHandler(payload) {
      const { origin, data } = payload;
      // action_intent_OPTION
      console.log(
        `No op-- decide on handler strategy, emit event or send to chat ${origin} ${data}`
      );
      if (typeof data === "string") {
        // This can be dispatch event or whatever
        this.send(data);
      }
    },

    grabFlags() {
      // Escape valve just in case...
      const flags = new URLSearchParams(window.location.search);
      const backendOverride = flags.get("backend");

      // todo: lets tedious
      if (backendOverride) {
        this.backend = backendOverride;
      }
      const triggerMessage = flags.get("triggermessage");
      if (triggerMessage && typeof triggerMessage === "string") {
        this.triggerMessage = triggerMessage;
      }
      const triggerShortcut = flags.get("triggershortcut") || "";
      if (triggerShortcut) {
        this.triggerShortcut = triggerShortcut;
      }
    },

    __debug(...payload) {
      if (this.debugMode) {
        console.log.apply(console, payload);
      }
    },
    addText(text, author = "agent") {
      this.messages.push({
        timestamp: new Date(),
        type: "text",
        author,
        content: text,
      });
    },
    addComponent(type, payload) {
      if (type === "suggestions") {
        return this.updateSuggestions(payload.map((item) => item.title));
      }
      this.messages.push({
        timestamp: new Date(),
        type,
        author: "agent",
        content: payload,
      });
    },
    addSuggestion(suggestion) {
      if (
        suggestion &&
        suggestion != " " &&
        !this.suggestions.includes(suggestion)
      ) {
        this.updateSuggestions([suggestion]);
      }
    },
    updateSuggestions(suggestions) {
      const { permanentSuggestions } = this;
      this.suggestions = [...permanentSuggestions, ...suggestions];
    },
    setHeights() {
      this.footerHeight = this.$refs.footerRef.clientHeight;
      this.headerHeight = this.$refs.headerRef.clientHeight;
      this.rootHeight = document.querySelector("#app").clientHeight;
    },
    requestHandler(payload) {
      const { request } = payload;
      if (request) {
        this.send(request);
      }

      // this.requestActive = false;
    },
    _localSave(key, val) {
      localStorage.setItem(key, JSON.stringify(val));
    },
    _localGet(key) {
      if (!key) key = this.storageKey;
      const candidate = localStorage.getItem(key);
      return candidate ? JSON.parse(candidate) : candidate;
    },
    saveDefaults() {
      const payload = {
        darkmode: false,
        animate: true,
        grpc: true,
        showcharacters: true,
        backend: this.backend,
        debugMode: false,
        userEntries: [],
      };

      this._localSave(this.storageKey, payload);
      this.loadSettings();
    },
    saveSettings() {
      const payload = {
        darkmode: this.darkmode,
        animate: this.animate,
        grpc: this.grpc,
        backend: this.backend,
        debugMode: this.debugMode,
        scrollToBottom: this.scrollToBottom,
        showcharacters: this.showcharacters,
        userEntries: this.userEntries,
      };
      this.settingsActive = false;
      return this._localSave(this.storageKey, payload);
    },
    getSettings() {
      return this._localGet();
    },
    loadSettings() {
      const settings = this.getSettings();
      if (settings) {
        for (let key in settings) {
          const val = settings[key];
          this[key] = val;
        }
      }
    },
    suggest(suggestion) {
      if (suggestion && typeof suggestion === "string") {
        this.send(suggestion);
        // Should make this configurable whether we dump all suggestions
        const { permanentSuggestions } = this;
        this.suggestions = [...permanentSuggestions];
      }
    },
    _scrollDown() {
      this.$nextTick(() => {
        const app = document.querySelector("#app");
        // TODO: less knucklehead way to scrolldown
        const distance = app.offsetTop + app.clientHeight * 2;
        if (this.animate) {
          // JANKY: If a card renders, need bit of delay to load in
          // TODO: get rid of this
          setTimeout(() => {
            window.scrollTo({ top: distance, behavior: "smooth" });
          }, 600);
        } else {
          window.scrollTo({ top: distance });
        }
      });
    },
    async send(payload) {
      if (!payload) return;
      let plainText;
      // Text case
      if (typeof payload === "string" && payload !== "" && payload !== " ") {
        plainText = payload;
        this.thinking = true;
        this.usermsg = "";
        this.addText(payload, "me");
        this.thinking = true;
        if (this.scrollToBottom) {
          this._scrollDown();
        }
        this.updateUserEntries(payload);
      } else {
        if (payload.kind === "text") {
          this.updateUserEntries(payload);
        }
      }
      // Send non-text-like event, requestData, etc
      this.thinking = true;
      let chatRes = { data: {} };
      try {
        const payload_template = {
          prompt: payload,
          samples: this.activePersona.samples || [],
          prefix: this.activePersona.prefix,
          APIFlags: this.activePersona.APIFlags,
          opts: {},
        };

        chatRes = await this.client.send(payload_template);
      } catch (e) {
        this.addText(
          this.debugMode ? e : `Whoops there was an issue, try that again?`
        );
        this.addSuggestion(plainText);
        if (this.scrollToBottom) {
          this._scrollDown();
        }
        this.thinking = false;
        return;
      }

      const { text } = chatRes.data;
      if (text) {
        this.addText(text);
      } else {
        this.addText(
          "<Empty completion, try adding a priming statement or more examples>"
        );
      }
      // this.addText(chatRes.data);
      // const [key] = Object.keys(chatRes.data);
      // if (key === "text") {
      //   const textNode = _.get(chatRes.data, "text", null);
      //   if (textNode) {
      //     this.addText(textNode);
      //   }
      // } else {
      //   alert("this is impossible");
      //   alert(`${key} ${JSON.stringify(chatRes.data)}`);
      //   this.addComponent(key, chatRes.data[key]);
      // }
      this.thinking = false;
      if (this.scrollToBottom) {
        this._scrollDown();
      }
    },
  },
};
</script>

<style>
/** HACK */
.vm--modal {
  overflow: scroll !important;
}
.df__logo {
  max-width: 85%;
}
.df__logo:hover {
  transform: scale(1.3) rotate3d(1, 1, 1, 45deg);
}
.message-list {
  overflow: auto;
}

.message {
  margin-bottom: 1%;
}

#app {
  font-family: "Press Start 2P";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.wrap {
  position: fixed;
  width: 100%;
  bottom: 0;
}

.hacky__close {
  position: absolute;
  right: 2%;
  top: 2%;
}

#app > section.is-dark {
  border-color: #212529 !important;
}

.hacky__close.is-dark .close:before {
  color: red;
}
.fixed--input {
  position: fixed;
  width: 100%;
  bottom: 0;
}
.fixed--suggestions {
  position: fixed;
  width: 100%;
  bottom: 10%;
}
.settings {
  display: flex;
  flex-direction: column;
}

.darkcat {
  background: rebeccapurple;
}

* {
  transition: all 0.3s ease-in;
}
.boom {
  font-family: "Press Start 2P", cursive;
}
.darkmode .vodal-dialog {
  background: #212529;
}
.lightmode .vodal-dialog {
  background: #fff;
}

.-left {
  display: flex;
  justify-content: flex-start;
}
.-right {
  display: flex;
  justify-content: flex-end;
}

.icon-fix {
  margin-bottom: 0 !important;
  /* padding-bottom: 3%; */
}

/* -- door -- */
@-webkit-keyframes door-enter {
  from {
    -webkit-transform: scale3d(0, 1, 1);
    transform: scale3d(0, 1, 1);
  }
}

@keyframes door-enter {
  from {
    -webkit-transform: scale3d(0, 1, 1);
    transform: scale3d(0, 1, 1);
  }
}

.door-enter-active {
  -webkit-animation: door-enter both cubic-bezier(0.4, 0, 0, 1.5);
  animation: door-enter both cubic-bezier(0.4, 0, 0, 1.5);
}

@-webkit-keyframes door-leave {
  60% {
    -webkit-transform: scale3d(0.01, 1, 1);
    transform: scale3d(0.01, 1, 1);
  }
  to {
    -webkit-transform: scale3d(0, 1, 0.1);
    transform: scale3d(0, 1, 0.1);
  }
}

@keyframes door-leave {
  60% {
    -webkit-transform: scale3d(0.01, 1, 1);
    transform: scale3d(0.01, 1, 1);
  }
  to {
    -webkit-transform: scale3d(0, 1, 0.1);
    transform: scale3d(0, 1, 0.1);
  }
}

.door-leave-active {
  -webkit-animation: door-leave both;
  animation: door-leave both;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.5s;
}
.scale-enter,
.scale-leave-active {
  opacity: 0;
  transform: scale(0.3) translateY(24px);
}
</style>
