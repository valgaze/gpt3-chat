<template>
  <section>
    <div
      class="nes-dialog"
      id="dialog-settings"
      :class="{ 'is-dark': darkmode }"
    >
      <button
        type="button"
        class="nes-btn is-success"
        @click="$modal.show('export-modal')"
      >
        Export
      </button>
      <label class="nes-btn">
        <span>Import</span>
        <input type="file" accept="application/JSON" @change="importPersonas" />
      </label>
      <label>
        <button
          @click="apiActive = !apiActive"
          type="button"
          class="nes-btn is-warning"
        >
          {{ apiActive ? "Back to Personas" : "Configure API \>" }}
        </button>
      </label>

      <div v-if="apiActive">
        <div class="nes-container with-title" :class="{ 'is-dark': darkmode }">
          <h3 class="title">API Config</h3>
          <div class="nes-field is-inline separator">
            <label
              for="inline_field"
              content="Quote object keys"
              v-tippy="{ arrow: true, animation: animate ? 'scale' : null }"
              >Note: Config needs to be valid JSON (quote keys, no trailing
              commas)
            </label>
            <textarea
              class="nes-textarea"
              placeholder=""
              v-model="beer"
              rows="5"
              ref="apiconfigref"
            ></textarea>
          </div>
          <div style="width:100%; display: flex; justify-content:flex-end">
            <button
              type="button"
              class="nes-btn is-success"
              @click="updateAPIConfig"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div class="nes-container with-title" :class="{ 'is-dark': darkmode }">
          <h3 class="title">API Flags</h3>

          <div class="nes-table-responsive">
            <table
              class="nes-table is-bordered is-centered"
              :class="{ 'is-dark': darkmode }"
            >
              <thead>
                <tr>
                  <th>Input</th>
                  <th>Output</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(doc, idx) in APIFlagDocs"
                  :key="idx"
                  :class="{ 'is-dark': darkmode }"
                >
                  <td>{{ doc.item }}</td>
                  <td>{{ doc.example }}</td>
                  <td>
                    {{ doc.remarks }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <form method="dialog" class="settings" name="builder" v-else>
        <p class="title">Priming Tools (select a persona below)</p>
        <div class="nes-container with-title" :class="{ 'is-dark': darkmode }">
          <p class="title">Personas (select from below)</p>

          <label
            v-for="(persona, key, idx) in personas"
            :key="idx"
            :content="persona.meta ? persona.meta.description : ''"
            v-tippy="{ arrow: true, animation: animate ? 'scale' : null }"
          >
            <input
              type="radio"
              class="nes-radio"
              name="answer"
              :value="key"
              v-model="tab"
              :class="{ 'is-dark': darkmode }"
            />
            <span>{{ persona.meta ? persona.meta.name : "[No Name]" }}</span>
          </label>
        </div>

        <div class="nes-container with-title" :class="{ 'is-dark': darkmode }">
          <h3 class="title">Priming</h3>

          <div class="nes-field is-inline separator">
            <label
              for="inline_field"
              content="A sentence or two to describe the agent's personality, maybe a name, etc)"
              v-tippy="{ arrow: true, animation: animate ? 'scale' : null }"
              >Priming Statement</label
            >
            <textarea
              @change="updatePrimer"
              class="nes-textarea"
              placeholder="The following is a conversation between a human and a helpful agent. The agent is kind, clever blah blah"
              v-model="activePersona.prefix"
              rows="5"
              ref="requestDataRef"
            ></textarea>
          </div>
        </div>

        <div class="nes-container with-title" :class="{ 'is-dark': darkmode }">
          <h3 class="title">Samples</h3>

          <div style="width:100%;display:flex;justify-content:flex-start;">
            <button
              type="button"
              class="nes-btn is-success"
              @click="startAddSample"
            >
              Add
            </button>
          </div>

          <div class="nes-table-responsive">
            <table
              class="nes-table is-bordered is-centered"
              :class="{ 'is-dark': darkmode }"
            >
              <thead>
                <tr>
                  <th>Input</th>
                  <th>Output</th>
                  <th>Edit</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(sample, idx) in activePersona.samples"
                  :key="idx"
                  :class="{ 'is-dark': darkmode }"
                >
                  <td>{{ sample[0] }}</td>
                  <td>{{ sample[1] }}</td>
                  <td>
                    <button
                      type="button"
                      class="nes-btn is-success"
                      @click="startEditor(idx)"
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="nes-btn is-error"
                      @click="removeSample(idx)"
                    >
                      X
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
    <!-- Export -->
    <modal
      name="export-modal"
      :adaptive="true"
      :draggable="true"
      :resizable="true"
      :class="{ 'is-dark': darkmode }"
      width="60%"
      height="50%"
    >
      <div
        class="nes-container with-title sample-modal"
        :class="{ 'is-dark': darkmode }"
      >
        <div
          class="hacky__close"
          :class="{ 'is-dark': darkmode }"
          @click="$modal.hide('export-modal')"
        >
          <i class="nes-icon close is-small"></i>
        </div>
        <h1>Exported Personas</h1>
        <textarea
          class="nes-textarea"
          placeholder=""
          rows="8"
          v-model="exportPersonas"
        ></textarea>
      </div>
    </modal>
    <!-- Gross modal w/in modal :/ --->
    <modal
      name="sample-modal"
      :adaptive="true"
      :draggable="true"
      :resizable="true"
      :class="{ 'is-dark': darkmode }"
      width="60%"
      height="80%"
    >
      <div
        class="nes-container with-title sample-modal"
        :class="{ 'is-dark': darkmode }"
      >
        <h3 class="title">Sample</h3>
        <div class="nes-field is-inline">
          <label for="inline_field">Input</label>
          <input
            type="text"
            class="nes-input"
            placeholder="input sample here"
            v-model="newInput"
          />
        </div>
        <div class="nes-field is-inline">
          <label for="inline_field">Output</label>
          <input
            type="text"
            class="nes-input"
            placeholder="output sample here"
            v-model="newOutput"
          />
        </div>

        If you need ideas/inspiration, see below:
        <ul style="text-align:left">
          <li>
            <a
              href="https://github.com/martonlanga/gpt3-prompts"
              _target="blank"
              >https://github.com/martonlanga/gpt3-prompts</a
            >
          </li>
          <li>
            <a href="https://gpt3examples.com">https://gpt3examples.com</a>
          </li>
        </ul>
      </div>

      <div style="display:flex; justify-content:flex-end; width:100%;">
        <button
          type="button"
          class="nes-btn is-error"
          @click="$modal.hide('sample-modal')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="nes-btn is-success"
          @click="addSample"
          v-if="addSampleFlag"
        >
          Add
        </button>
        <button
          type="button"
          class="nes-btn is-success"
          @click="editSample"
          v-else
        >
          Save
        </button>
        <!-- <button type="button" class="nes-btn is-success">Add</button> -->
      </div>
    </modal>
  </section>
</template>

<script>
const requestTemplate = `{
	"session": "1234567890987",
	"queryInput": {
		"text": {
			"text": "yes",
			"languageCode": "en-us"
		}
	},
	"queryParams": {
		"payload": {}
	}
}`;
export default {
  name: "request",
  mounted() {
    this.tab = this.personaKey;
  },
  computed: {
    exportPersonas() {
      return JSON.stringify(this.personas);
    },
  },
  watch: {
    apiActive(newVal) {
      if (newVal) {
        if (this.activePersona.APIFlags) {
          this.beer = JSON.stringify(this.activePersona.APIFlags);
        } else {
          this.beer = JSON.stringify(this.defaultAPIFlags);
        }
      }
    },
    beer(newVal) {
      this.verifyJSON(newVal, this.$refs.apiconfigref);
    },
    tab: {
      immediate: true,
      handler: function(newVal) {
        this.updatePersona(newVal);
      },
    },
    codeActive() {},
    eventParameters(newVal) {
      if (this.enforceStrictJSON) {
        this.verifyJSON(newVal, this.$refs.eventParametersRef);
      }
    },
    grpc(newVal) {
      this.transformgrpc = Boolean(newVal);
    },
    transformgrpc(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.requestBlock = JSON.stringify(this.buildReq(), undefined, 4);
      }
    },
    defaultSession(newVal) {
      if (newVal) {
        this.session = newVal;
      }
    },
    isEvent(newVal) {
      if (newVal === "no") {
        this.eventActive = false;
        this.textActive = true;
      } else {
        this.eventActive = true;
      }
    },
    selectedCode: {
      immediate: true,
      handler: function(val) {
        this.activeLanguage = val;
      },
    },
  },
  data() {
    return {
      beer: JSON.stringify({ a: 1, b: 2 }),
      apiActive: false,
      addSampleFlag: false,
      newInput: "",
      newOutput: "",
      prefix: "",
      primingStatement: "",
      activeSamples: [],
      tab: "default",
      enforceStrictJSON: true,
      textActive: false,
      eventName: "",
      eventParameters: JSON.stringify({ a: 1, b: 2 }),
      requestData: JSON.stringify({ a: 1, b: 2 }),
      textMessage: "",
      activeLanguage: this.selectedCode,
      eventActive: false,
      isEvent: "no",
      transformgrpc: this.grpc,
      codeActive: false,
      requestBlock: requestTemplate,
      session: this.defaultSession,
      APIFlagDocs: [
        {
          item: "engine",
          example: "davinci",
          remarks:
            "Engine id (there are 4 main engines ada/babbage/curie/davinci vary by latency/performance)",
        },
        // {
        //   item: "prompt",
        //   example: "//",
        //   remarks: "Input which will be completed by the system",
        // },
        {
          item: "max_tokens",
          example: "20",
          remarks:
            "How many tokens (words or portions of words) to return in a completion, max of 512",
        },
        {
          item: "temperature",
          example: "0.5",
          remarks: "0-1, 0 means more predictable and more to 1 is more random",
        },
        {
          item: "top_p",
          example: "//",
          remarks:
            "0-1, represents a percentage threshold for values it will accept. Use this OR temperature",
        },
        {
          item: "n",
          example: "//",
          remarks: "Number of choices to create for each prompt",
        },
        { item: "stream", example: "//", remarks: "True/false" },
        {
          item: "logprobs",
          example: "//",
          remarks: "Return n most likely tokens",
        },
        { item: "stop", example: "\n", remarks: "Stopping character" },
      ],
    };
  },
  methods: {
    importPersonas(event) {
      var input = event.target;

      var reader = new FileReader();
      reader.onload = function() {
        try {
          const data = JSON.parse(reader.result);
          this.$emit("importPersonas", { personas: data });
        } catch (e) {
          alert(
            `Error parsing file, make sure it is valid JSON (keys quoted, no trailing commas ${JSON.stringify(
              e
            )}`
          );
        }
      }.bind(this);
      reader.readAsText(input.files[0]);
      // reader.readAsDataURL(input.files[0]);
    },
    updateAPIConfig() {
      try {
        const reg = JSON.parse(this.beer);
        this.$emit("updateAPIConfig", { APIFlags: reg });
      } catch (e) {
        console.error(e);
      }
    },
    startAddSample() {
      this.newInput = "";
      this.newOutput = "";
      this.addSampleFlag = true;
      this.$modal.show("sample-modal");
    },
    startEditor(index) {
      this.addSampleFlag = false;
      const [input, output] = this.activePersona.samples[index];
      this.newInput = input;
      this.newOutput = output;
      this.activeSampleIndex = index;
      this.$modal.show("sample-modal");
    },
    updatePrimer() {
      console.log("Fire", Math.random());
    },
    updatePersona() {
      this.$emit("updatePersona", { personaKey: this.tab });
    },
    removeSample(index) {
      this.$emit("removeSample", { personaKey: this.tab, index });
    },
    editSample() {
      this.$modal.hide("sample-modal");
      const sample = [this.newInput, this.newOutput];
      this.$emit("editSample", {
        personaKey: this.tab,
        sample,
        index: this.activeSampleIndex,
      });
      this.activeSampleIndex = "";
      this.newInput = "";
      this.newOutput = "";
    },
    addSample() {
      const input = this.newInput;
      const output = this.newOutput;
      if (input && output) {
        const sample = [input, output];
        this.$emit("addSample", { sample });
        this.$modal.hide("sample-modal");
      }
    },
    send() {
      const req = this.buildReq();
      this.$emit("boom", { request: req });
    },
    verifyJSON(value, ref) {
      // Carol Skelly's wonderful zero-dependency JSON linter: https://medium.com/wdstack/vue-json-lint-4d665671e993
      // reset error
      let jsonerror = "";
      let jsonValue = "";
      try {
        // try to parse
        jsonValue = JSON.parse(value);
      } catch (e) {
        jsonerror = JSON.stringify(e.message);
        var textarea = ref;
        if (jsonerror.indexOf("position") > -1) {
          // highlight error position
          var positionStr = jsonerror.lastIndexOf("position") + 8;
          var posi = parseInt(
            jsonerror.substr(positionStr, jsonerror.lastIndexOf('"'))
          );
          if (posi >= 0) {
            textarea.setSelectionRange(posi, posi + 1);
          }
        }
        return "";
      }
      // we may want to think about this
      return JSON.stringify(jsonValue, null, 2);
    },
    _json2proto(input) {
      // TODO: replace w/ pb-util w/ lib
      return input;
    },
    genSession() {
      // TODO: replace w/ lib
      this.session = String(Math.random()).slice(2);
    },
    _buildEvent() {
      const payload = {
        kind: "event",
        content: {
          name: this.eventName,
          parameters: this.eventParameters
            ? JSON.parse(this.eventParameters)
            : {},
          languageCode: this.activeLanguage,
        },
        requestData: this.requestData ? JSON.parse(this.requestData) : {},
        flags: {
          transformgrpc: this.transformgrpc,
        },
      };
      return payload;
    },
    _buildTxt() {
      const payload = {
        kind: "text",
        content: this.textMessage,
        requestData: this.requestData ? JSON.parse(this.requestData) : {},
        flags: {
          transformgrpc: this.transformgrpc,
        },
      };
      return payload;
    },
    buildReq() {
      let req = {};
      if (this.eventActive) {
        req = this.client.buildRequest(this._buildEvent());
      } else {
        req = this.client.buildRequest(this._buildTxt());
      }
      return req;
    },
    copy() {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      // TODO: Thought this was fixed w/ v-show...
      if (isSafari) {
        alert(
          `There's some bug affecting only safari when switching elements in a modal. Just select all on the next prompt`
        );
        prompt(
          "Select all to copy/paste request data",
          JSON.stringify(this.buildReq(), undefined, 4)
        );
      } else {
        this.codeActive = true;
        this.requestBlock = JSON.stringify(this.buildReq(), undefined, 4);
      }
    },
  },
  props: {
    defaultAPIFlags: {
      type: Object,
      default: () => {
        return {
          max_tokens: 20,
          temperature: 0.3,
          stop: "\n",
        };
      },
    },
    personaKey: {
      type: String,
    },
    activePersona: {
      type: Object,
      // default: () => "default",
    },
    personas: {
      type: Object,
    },
    client: {},
    selectedCode: {
      type: String,
      default: () => "en-US",
    },
    defaultSession: {
      type: String,
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
    grpc: {
      type: Boolean,
      default: () => true,
    },
    languageCodes: {
      type: Array,
      default: () => [
        "zh-HK",
        "zh-CN",
        "zh-TW",
        "da",
        "nl",
        "en",
        "en-AU",
        "en-CA",
        "en-GB",
        "en-IN",
        "en-US",
        "fr",
        "fr-CA",
        "fr-FR",
        "de",
        "hi",
        "id",
        "it",
        "ja",
        "ko",
        "no",
        "pl",
        "pt-BR",
        "pt",
        "ru",
        "es",
        "es-419",
        "es-ES",
        "sv",
        "th",
        "tr",
        "uk",
      ],
    },
  },
};
</script>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
}
.separator {
  margin-top: 2%;
}

.json {
  height: 17rem;
}
</style>
